import { timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const AUTH_REALM = 'Basic realm="ForkTTY telemetry", charset="UTF-8"';
const AUTH_FAILURE_LIMIT = 5;
const AUTH_LOCKOUT_MS = 15 * 60 * 1000;
const AUTH_RETRY_AFTER_SECONDS = Math.ceil(AUTH_LOCKOUT_MS / 1000);
const NOINDEX_HEADER = "noindex, nofollow, noarchive";
const TELEMETRY_KEY_PREFIX = "telemetry:ping:";
const SCAN_COUNT = "200";
const MAX_SCAN_PAGES = 20;
const MAX_KEYS = 1000;
const NUMERIC_RANGES = [7, 30, 90] as const;
const DEFAULT_RANGE: DashboardRange = 30;

type AdminCredentials = {
  user: string;
  password: string;
};

type AuthFailureRecord = {
  failures: number;
  lockedUntil: number;
};

type TelemetryRow = {
  date: string;
  version: string;
  count: number;
};

type DashboardRange = (typeof NUMERIC_RANGES)[number] | "all";

type DashboardFilters = {
  range: DashboardRange;
  version: string | null;
  format: "html" | "csv";
};

type DailyTotal = {
  date: string;
  count: number;
};

type VersionSummary = {
  version: string;
  count: number;
  latestDate: string;
  share: number;
};

type DashboardModel = {
  filters: DashboardFilters;
  filteredRows: TelemetryRow[];
  versions: string[];
  latestDate: string | null;
  dailyTotals: DailyTotal[];
  versionSummaries: VersionSummary[];
  totals: {
    latestDay: number;
    last7Days: number;
    last30Days: number;
    selected: number;
  };
};

type RedisCredentials = {
  url: string;
  token: string;
};

type RedisCommand = readonly [string, ...unknown[]];

type RedisPipelineEntry = {
  result?: unknown;
  error?: string;
};

export async function GET(request: Request): Promise<Response> {
  const filters = readDashboardFilters(new URL(request.url));
  const adminCredentials = readAdminCredentials();
  if (!adminCredentials) {
    return htmlResponse(renderMessage("Telemetry admin is not configured", [
      "Set TELEMETRY_ADMIN_PASSWORD in Vercel, then redeploy.",
      "TELEMETRY_ADMIN_USER is optional and defaults to admin.",
    ]), 503);
  }

  const authKey = authRateLimitKey(request);
  if (isAuthLocked(authKey)) {
    return authFailureResponse(429);
  }

  if (!authorized(request.headers.get("authorization"), adminCredentials)) {
    recordAuthFailure(authKey);
    return authFailureResponse(401);
  }
  clearAuthFailures(authKey);

  const credentials = redisCredentials();
  if (!credentials) {
    return htmlResponse(renderMessage("Redis credentials are not configured", [
      "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, or the TELEMETRY_REDIS_REST_* equivalents.",
    ]), 503);
  }

  try {
    const rows = await loadTelemetryRows(credentials);
    const model = buildDashboardModel(rows, filters);
    if (filters.format === "csv") {
      return csvResponse(model);
    }
    return htmlResponse(renderTelemetry(model), 200);
  } catch {
    return htmlResponse(renderMessage("Could not load telemetry", [
      "The Redis request failed. Check the Upstash token and retry.",
    ]), 502);
  }
}

function readDashboardFilters(url: URL): DashboardFilters {
  const range = parseRange(url.searchParams.get("range"));
  const version = url.searchParams.get("version")?.trim() || null;
  const format = url.searchParams.get("format") === "csv" ? "csv" : "html";
  return { range, version, format };
}

function parseRange(value: string | null): DashboardRange {
  if (value === "all") {
    return "all";
  }
  const range = Number(value);
  return NUMERIC_RANGES.includes(range as (typeof NUMERIC_RANGES)[number])
    ? (range as DashboardRange)
    : DEFAULT_RANGE;
}

function readAdminCredentials(): AdminCredentials | null {
  const password = process.env.TELEMETRY_ADMIN_PASSWORD;
  if (!password) {
    return null;
  }
  return {
    user: process.env.TELEMETRY_ADMIN_USER || "admin",
    password,
  };
}

function redisCredentials(): RedisCredentials | null {
  const url =
    process.env.TELEMETRY_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.TELEMETRY_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  return {
    url: url.replace(/\/+$/, ""),
    token,
  };
}

async function redisPipeline(
  credentials: RedisCredentials,
  commands: readonly RedisCommand[],
): Promise<RedisPipelineEntry[]> {
  const response = await fetch(`${credentials.url}/pipeline`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${credentials.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(commands),
  });
  if (!response.ok) {
    throw new Error(`Redis request failed with HTTP ${response.status}`);
  }

  const body: unknown = await response.json();
  if (!Array.isArray(body)) {
    throw new Error("Redis pipeline response was not an array");
  }
  return body as RedisPipelineEntry[];
}

function authFailureResponse(status: 401 | 429): Response {
  return new Response(
    status === 429 ? "Too many authentication attempts" : "Authentication required",
    {
      status,
      headers: {
        "cache-control": "no-store",
        "www-authenticate": AUTH_REALM,
        "x-robots-tag": NOINDEX_HEADER,
        ...(status === 429 ? { "retry-after": String(AUTH_RETRY_AFTER_SECONDS) } : {}),
      },
    },
  );
}

function authRateLimitKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip =
    forwardedFor ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown";
  return `telemetry-admin:${ip}`;
}

function authFailureStore(): Map<string, AuthFailureRecord> {
  const globalState = globalThis as typeof globalThis & {
    __forkttyTelemetryAuthFailures?: Map<string, AuthFailureRecord>;
  };
  globalState.__forkttyTelemetryAuthFailures ??= new Map();
  return globalState.__forkttyTelemetryAuthFailures;
}

function isAuthLocked(key: string): boolean {
  const store = authFailureStore();
  const record = store.get(key);
  if (!record) {
    return false;
  }
  if (record.lockedUntil > Date.now()) {
    return true;
  }
  if (record.lockedUntil > 0) {
    store.delete(key);
  }
  return false;
}

function recordAuthFailure(key: string): void {
  const store = authFailureStore();
  const now = Date.now();
  const current = store.get(key);
  const failures = (
    current?.lockedUntil && current.lockedUntil <= now ? 0 : current?.failures ?? 0
  ) + 1;
  store.set(key, {
    failures,
    lockedUntil: failures >= AUTH_FAILURE_LIMIT ? now + AUTH_LOCKOUT_MS : 0,
  });
}

function clearAuthFailures(key: string): void {
  authFailureStore().delete(key);
}

function authorized(header: string | null, credentials: AdminCredentials): boolean {
  if (!header?.startsWith("Basic ")) {
    return false;
  }

  let decoded: string;
  try {
    decoded = Buffer.from(header.slice("Basic ".length), "base64").toString("utf8");
  } catch {
    return false;
  }

  const separator = decoded.indexOf(":");
  if (separator < 0) {
    return false;
  }
  const user = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);
  return secureEquals(user, credentials.user) && secureEquals(password, credentials.password);
}

function secureEquals(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  if (leftBytes.length !== rightBytes.length) {
    return false;
  }
  return timingSafeEqual(leftBytes, rightBytes);
}

async function loadTelemetryRows(credentials: RedisCredentials): Promise<TelemetryRow[]> {
  const keys = await scanTelemetryKeys(credentials);
  if (keys.length === 0) {
    return [];
  }

  const replies = await redisPipeline(
    credentials,
    keys.map((key) => ["GET", key]),
  );
  const rows = keys.flatMap((key, index) => {
    const parsed = parseTelemetryKey(key);
    const count = parseCount(replies[index]?.result);
    return parsed && count > 0 ? [{ ...parsed, count }] : [];
  });

  rows.sort((left, right) => {
    const dateOrder = right.date.localeCompare(left.date);
    return dateOrder || left.version.localeCompare(right.version);
  });
  return rows;
}

async function scanTelemetryKeys(credentials: RedisCredentials): Promise<string[]> {
  const keys = new Set<string>();
  let cursor = "0";

  for (let page = 0; page < MAX_SCAN_PAGES; page += 1) {
    const replies = await redisPipeline(credentials, [
      ["SCAN", cursor, "MATCH", `${TELEMETRY_KEY_PREFIX}*`, "COUNT", SCAN_COUNT],
    ]);
    const result = replies[0]?.result;
    if (!Array.isArray(result) || result.length !== 2) {
      throw new Error("Unexpected Redis SCAN response");
    }

    cursor = String(result[0]);
    const pageKeys = Array.isArray(result[1]) ? result[1] : [];
    for (const key of pageKeys) {
      if (typeof key === "string" && key.startsWith(TELEMETRY_KEY_PREFIX)) {
        keys.add(key);
      }
      if (keys.size >= MAX_KEYS) {
        return [...keys];
      }
    }

    if (cursor === "0") {
      break;
    }
  }

  return [...keys];
}

function parseTelemetryKey(key: string): Omit<TelemetryRow, "count"> | null {
  if (!key.startsWith(TELEMETRY_KEY_PREFIX)) {
    return null;
  }

  const rest = key.slice(TELEMETRY_KEY_PREFIX.length);
  const date = rest.slice(0, 10);
  if (rest[10] !== ":" || !validDate(date)) {
    return null;
  }

  const version = rest.slice(11);
  if (!version) {
    return null;
  }
  return { date, version };
}

function parseCount(value: unknown): number {
  const count = typeof value === "number" ? value : Number(value);
  return Number.isSafeInteger(count) && count > 0 ? count : 0;
}

function validDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

function buildDashboardModel(rows: TelemetryRow[], filters: DashboardFilters): DashboardModel {
  const latestDate = rows[0]?.date ?? null;
  const versions = [...new Set(rows.map((row) => row.version))].sort((left, right) =>
    left.localeCompare(right),
  );
  const versionRows = filters.version
    ? rows.filter((row) => row.version === filters.version)
    : rows;
  const filteredRows = filterRowsByRange(versionRows, filters.range, latestDate);
  return {
    filters,
    filteredRows,
    versions,
    latestDate,
    dailyTotals: buildDailyTotals(filteredRows, filters.range, latestDate),
    versionSummaries: summarizeVersions(filteredRows),
    totals: {
      latestDay: latestDate
        ? sumRows(versionRows.filter((row) => row.date === latestDate))
        : 0,
      last7Days: sumRows(filterRowsByRange(versionRows, 7, latestDate)),
      last30Days: sumRows(filterRowsByRange(versionRows, 30, latestDate)),
      selected: sumRows(filteredRows),
    },
  };
}

function filterRowsByRange(
  rows: TelemetryRow[],
  range: DashboardRange,
  anchorDate: string | null,
): TelemetryRow[] {
  if (range === "all" || !anchorDate) {
    return rows;
  }
  const startDate = shiftDate(anchorDate, -(range - 1));
  return rows.filter((row) => row.date >= startDate && row.date <= anchorDate);
}

function buildDailyTotals(
  rows: TelemetryRow[],
  range: DashboardRange,
  anchorDate: string | null,
): DailyTotal[] {
  const totals = new Map<string, number>();
  for (const row of rows) {
    totals.set(row.date, (totals.get(row.date) ?? 0) + row.count);
  }

  if (range === "all" || !anchorDate) {
    return [...totals.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, count]) => ({ date, count }));
  }

  const days: DailyTotal[] = [];
  for (let offset = range - 1; offset >= 0; offset -= 1) {
    const date = shiftDate(anchorDate, -offset);
    days.push({ date, count: totals.get(date) ?? 0 });
  }
  return days;
}

function summarizeVersions(rows: TelemetryRow[]): VersionSummary[] {
  const total = sumRows(rows);
  const summaries = new Map<string, { count: number; latestDate: string }>();
  for (const row of rows) {
    const current = summaries.get(row.version);
    summaries.set(row.version, {
      count: (current?.count ?? 0) + row.count,
      latestDate:
        current && current.latestDate > row.date ? current.latestDate : row.date,
    });
  }

  return [...summaries.entries()]
    .map(([version, summary]) => ({
      version,
      count: summary.count,
      latestDate: summary.latestDate,
      share: total > 0 ? summary.count / total : 0,
    }))
    .sort((left, right) => right.count - left.count || left.version.localeCompare(right.version));
}

function sumRows(rows: TelemetryRow[]): number {
  return rows.reduce((total, row) => total + row.count, 0);
}

function shiftDate(date: string, days: number): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function renderTelemetry(model: DashboardModel): string {
  const topVersion = model.versionSummaries[0];
  const topVersionShare = topVersion ? formatPercent(topVersion.share) : "n/a";
  const topVersionDetail = topVersion
    ? `${topVersion.version} · ${model.totals.selected.toLocaleString("en-US")} pings in selected range`
    : "No pings in selected range";
  const selectedContext = model.filters.version
    ? `Version ${model.filters.version}`
    : "All versions";
  const updatedAt = new Date().toISOString();

  return page("ForkTTY telemetry", `
    <header class="page-header">
      <p class="eyebrow">Private admin</p>
      <div class="header-line">
        <div>
          <h1>ForkTTY telemetry</h1>
          <p class="lede">Anonymous daily pings. Treat these as installs that pinged, not guaranteed unique people.</p>
        </div>
        <a class="export-link" href="${escapeHtml(dashboardHref(model.filters, { format: "csv" }))}">Export CSV</a>
      </div>
      <p class="meta">
        Last updated <time datetime="${escapeHtml(updatedAt)}">${escapeHtml(formatTimestamp(updatedAt))}</time>
        <span aria-hidden="true">·</span>
        ${escapeHtml(rangeLabel(model.filters.range))}
        <span aria-hidden="true">·</span>
        ${escapeHtml(selectedContext)}
      </p>
    </header>

    ${renderControls(model)}

    <section class="stats" aria-label="Telemetry summary">
      ${stat("Latest day pings", model.totals.latestDay.toLocaleString("en-US"), model.latestDate ?? "No pings yet")}
      ${stat("Last 7 days", model.totals.last7Days.toLocaleString("en-US"), "Anchored to latest recorded day")}
      ${stat("Last 30 days", model.totals.last30Days.toLocaleString("en-US"), "Anchored to latest recorded day")}
      ${stat("Top version share", topVersionShare, topVersionDetail)}
    </section>

    <div class="dashboard-grid">
      ${renderDailyTrend(model)}
      ${renderVersionAdoption(model)}
    </div>

    ${renderRowsTable(model)}
  `);
}

function renderControls(model: DashboardModel): string {
  const ranges: DashboardRange[] = [7, 30, 90, "all"];
  return `<section class="toolbar" aria-label="Telemetry filters">
    <nav class="range-picker" aria-label="Date range">
      ${ranges
        .map((range) => {
          const active = range === model.filters.range;
          return `<a href="${escapeHtml(dashboardHref(model.filters, { range, format: "html" }))}" class="${active ? "active" : ""}"${active ? ' aria-current="page"' : ""}>${escapeHtml(rangeLabel(range))}</a>`;
        })
        .join("")}
    </nav>
    <form class="version-filter" method="GET" action="/admin/telemetry">
      <input type="hidden" name="range" value="${escapeHtml(String(model.filters.range))}">
      <label for="version">Version</label>
      <select id="version" name="version">
        <option value="">All versions</option>
        ${model.versions
          .map((version) => `<option value="${escapeHtml(version)}"${version === model.filters.version ? " selected" : ""}>${escapeHtml(version)}</option>`)
          .join("")}
      </select>
      <button type="submit">Apply</button>
    </form>
  </section>`;
}

function renderDailyTrend(model: DashboardModel): string {
  const max = Math.max(1, ...model.dailyTotals.map((day) => day.count));
  return `<section class="panel chart-panel" aria-labelledby="daily-trend-title">
    <div class="panel-heading">
      <div>
        <h2 id="daily-trend-title">Daily trend</h2>
        <p>${escapeHtml(rangeLabel(model.filters.range))}, shown as pings per day.</p>
      </div>
    </div>
    ${
      model.dailyTotals.length === 0
        ? '<p class="empty">No telemetry pings have been recorded yet.</p>'
        : `<figure>
            <div class="bars" aria-hidden="true">
              ${model.dailyTotals
                .map((day) => {
                  const height = Math.max(4, Math.round((day.count / max) * 100));
                  return `<div class="bar-wrap" title="${escapeHtml(`${day.date}: ${day.count} pings`)}">
                    <div class="bar" style="height:${height}%"></div>
                    <span>${escapeHtml(shortDate(day.date))}</span>
                  </div>`;
                })
                .join("")}
            </div>
            <figcaption>
              Bars compare daily ping volume. The table below exposes the same values for copying and assistive technology.
            </figcaption>
          </figure>
          <details class="data-disclosure">
            <summary>Daily trend data</summary>
            ${renderDailyTable(model.dailyTotals)}
          </details>`
    }
  </section>`;
}

function renderVersionAdoption(model: DashboardModel): string {
  return `<section class="panel" aria-labelledby="version-adoption-title">
    <div class="panel-heading">
      <div>
        <h2 id="version-adoption-title">Version adoption</h2>
        <p>Distribution inside the selected range.</p>
      </div>
    </div>
    ${
      model.versionSummaries.length === 0
        ? '<p class="empty">No versions match the current filters.</p>'
        : `<div class="version-list">
            ${model.versionSummaries
              .map((summary) => {
                const width = Math.max(2, Math.round(summary.share * 100));
                return `<div class="version-row">
                  <div class="version-name">
                    <code>${escapeHtml(summary.version)}</code>
                    <span>Last seen <time datetime="${escapeHtml(summary.latestDate)}">${escapeHtml(summary.latestDate)}</time></span>
                  </div>
                  <div class="version-meter" aria-hidden="true"><span style="width:${width}%"></span></div>
                  <div class="version-count">
                    <strong>${summary.count.toLocaleString("en-US")}</strong>
                    <span>${escapeHtml(formatPercent(summary.share))}</span>
                  </div>
                </div>`;
              })
              .join("")}
          </div>`
    }
  </section>`;
}

function renderRowsTable(model: DashboardModel): string {
  return `<section class="panel table-panel" aria-labelledby="raw-pings-title">
    <div class="panel-heading">
      <div>
        <h2 id="raw-pings-title">Raw pings</h2>
        <p>${model.filteredRows.length.toLocaleString("en-US")} aggregate rows match the current filters.</p>
      </div>
    </div>
    ${
      model.filteredRows.length === 0
        ? '<p class="empty">No telemetry pings match the current filters.</p>'
        : `<div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Version</th>
                  <th scope="col" class="numeric">Pings</th>
                </tr>
              </thead>
              <tbody>
                ${model.filteredRows.map(renderTelemetryRow).join("")}
              </tbody>
            </table>
          </div>`
    }
  </section>`;
}

function renderTelemetryRow(row: TelemetryRow): string {
  return `<tr>
    <td><time datetime="${escapeHtml(row.date)}">${escapeHtml(row.date)}</time></td>
    <td><code>${escapeHtml(row.version)}</code></td>
    <td class="numeric">${row.count.toLocaleString("en-US")}</td>
  </tr>`;
}

function renderDailyTable(days: DailyTotal[]): string {
  return `<div class="table-scroll">
    <table class="compact-table">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col" class="numeric">Pings</th>
        </tr>
      </thead>
      <tbody>
        ${days
          .map((day) => `<tr>
            <td><time datetime="${escapeHtml(day.date)}">${escapeHtml(day.date)}</time></td>
            <td class="numeric">${day.count.toLocaleString("en-US")}</td>
          </tr>`)
          .join("")}
      </tbody>
    </table>
  </div>`;
}

function renderMessage(title: string, lines: string[]): string {
  return page(title, `
    <header>
      <p class="eyebrow">Private admin</p>
      <h1>${escapeHtml(title)}</h1>
    </header>
    <div class="message">
      ${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
    </div>
  `);
}

function stat(label: string, value: string, detail = ""): string {
  return `<div class="stat">
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(value)}</strong>
    ${detail ? `<small>${escapeHtml(detail)}</small>` : ""}
  </div>`;
}

function csvResponse(model: DashboardModel): Response {
  const versionSuffix = model.filters.version
    ? `-${sanitizeFilename(model.filters.version)}`
    : "";
  const filename = `forktty-telemetry-${rangeSlug(model.filters.range)}${versionSuffix}.csv`;
  return new Response(renderCsv(model.filteredRows), {
    status: 200,
    headers: {
      "cache-control": "no-store",
      "content-disposition": `attachment; filename="${filename}"`,
      "content-type": "text/csv; charset=utf-8",
      "x-robots-tag": NOINDEX_HEADER,
    },
  });
}

function renderCsv(rows: TelemetryRow[]): string {
  return [
    "date,version,pings",
    ...rows.map((row) => [
      csvCell(row.date),
      csvCell(row.version),
      String(row.count),
    ].join(",")),
    "",
  ].join("\n");
}

function csvCell(value: string): string {
  const safeValue = /^[=+\-@\t]/.test(value) ? `'${value}` : value;
  if (!/[",\n\r]/.test(safeValue)) {
    return safeValue;
  }
  return `"${safeValue.replace(/"/g, '""')}"`;
}

function dashboardHref(
  filters: DashboardFilters,
  overrides: Partial<DashboardFilters> & { version?: string | null },
): string {
  const range = overrides.range ?? filters.range;
  const version = Object.prototype.hasOwnProperty.call(overrides, "version")
    ? overrides.version ?? null
    : filters.version;
  const format = overrides.format ?? "html";
  const params = new URLSearchParams();
  params.set("range", String(range));
  if (version) {
    params.set("version", version);
  }
  if (format === "csv") {
    params.set("format", "csv");
  }
  return `/admin/telemetry?${params.toString()}`;
}

function rangeLabel(range: DashboardRange): string {
  return range === "all" ? "All time" : `Last ${range} days`;
}

function rangeSlug(range: DashboardRange): string {
  return range === "all" ? "all" : `${range}d`;
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "0%";
  }
  if (value < 0.01) {
    return "<1%";
  }
  return `${Math.round(value * 100)}%`;
}

function formatTimestamp(value: string): string {
  return `${value.slice(0, 19).replace("T", " ")} UTC`;
}

function shortDate(date: string): string {
  return date.slice(5);
}

function sanitizeFilename(value: string): string {
  return value.replace(/[^0-9A-Za-z._-]+/g, "-").slice(0, 80);
}

function htmlResponse(body: string, status: number): Response {
  return new Response(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": NOINDEX_HEADER,
    },
  });
}

function page(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
	  <title>${escapeHtml(title)}</title>
	  <style>
	    :root {
	      color-scheme: dark;
	      background: #121212;
	      color: #f4efe7;
	      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	    }
	    * {
	      box-sizing: border-box;
	    }
	    body {
	      margin: 0;
	      min-height: 100vh;
	      background: #121212;
	    }
	    a {
	      color: inherit;
	    }
	    main {
	      width: min(1180px, calc(100% - 32px));
	      margin: 0 auto;
	      padding: 42px 0;
	    }
	    .page-header {
	      margin-bottom: 20px;
	    }
	    .header-line {
	      display: flex;
	      align-items: flex-start;
	      justify-content: space-between;
	      gap: 20px;
	    }
	    .eyebrow {
	      margin: 0 0 10px;
	      color: #7dd3fc;
	      font: 700 12px/1.2 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
	      letter-spacing: 0;
	      text-transform: uppercase;
	    }
	    h1, h2 {
	      margin: 0;
	      color: #fff8ee;
	    }
	    h1 {
	      font-size: 42px;
	      line-height: 1;
	    }
	    h2 {
	      font-size: 18px;
	      line-height: 1.2;
	    }
	    .lede {
	      max-width: 760px;
	      margin: 14px 0 0;
	      color: #b9b0a5;
	      font-size: 16px;
	      line-height: 1.55;
	    }
	    .meta, .panel-heading p, figcaption, .version-name span, .version-count span, .stat small {
	      color: #9f968d;
	    }
	    .meta {
	      margin: 16px 0 0;
	      font-size: 13px;
	    }
	    .export-link, .range-picker a, .version-filter button {
	      border: 1px solid #4a4037;
	      border-radius: 8px;
	      background: #1f1d1a;
	      text-decoration: none;
	    }
	    .export-link {
	      flex: 0 0 auto;
	      padding: 10px 12px;
	      color: #f4efe7;
	      font-size: 13px;
	      font-weight: 700;
	    }
	    .toolbar {
	      display: flex;
	      align-items: center;
	      justify-content: space-between;
	      gap: 16px;
	      margin: 24px 0;
	    }
	    .range-picker {
	      display: flex;
	      flex-wrap: wrap;
	      gap: 8px;
	    }
	    .range-picker a {
	      padding: 9px 11px;
	      color: #cfc6bc;
	      font-size: 13px;
	    }
	    .range-picker a.active {
	      border-color: #7dd3fc;
	      background: #15313a;
	      color: #e4fbff;
	    }
	    .version-filter {
	      display: flex;
	      align-items: center;
	      gap: 8px;
	    }
	    .version-filter label {
	      color: #b9b0a5;
	      font-size: 13px;
	    }
	    .version-filter select {
	      min-width: 220px;
	      max-width: min(42vw, 360px);
	      border: 1px solid #4a4037;
	      border-radius: 8px;
	      background: #1b1a17;
	      color: #f4efe7;
	      padding: 9px 10px;
	    }
	    .version-filter button {
	      color: #f4efe7;
	      cursor: pointer;
	      padding: 9px 12px;
	    }
	    .stats {
	      display: grid;
	      grid-template-columns: repeat(4, minmax(0, 1fr));
	      gap: 12px;
	      margin: 0 0 16px;
	    }
	    .stat, .message, .panel {
	      border: 1px solid #3b342d;
	      border-radius: 8px;
	      background: #1e1d1a;
	    }
	    .stat {
	      min-height: 126px;
	      padding: 18px;
	    }
	    .stat span {
	      display: block;
	      color: #9f968d;
	      font-size: 12px;
	      text-transform: uppercase;
	    }
	    .stat strong {
	      display: block;
	      margin-top: 10px;
	      overflow-wrap: anywhere;
	      color: #fff8ee;
	      font-size: 27px;
	      line-height: 1.1;
	    }
	    .stat small {
	      display: block;
	      margin-top: 9px;
	      font-size: 12px;
	      line-height: 1.35;
	    }
	    .dashboard-grid {
	      display: grid;
	      grid-template-columns: minmax(0, 1.25fr) minmax(340px, 0.75fr);
	      gap: 16px;
	      margin-top: 16px;
	    }
	    .panel {
	      padding: 18px;
	    }
	    .table-panel {
	      margin-top: 16px;
	    }
	    .panel-heading {
	      display: flex;
	      align-items: flex-start;
	      justify-content: space-between;
	      gap: 14px;
	      margin-bottom: 16px;
	    }
	    .panel-heading p {
	      margin: 6px 0 0;
	      font-size: 13px;
	      line-height: 1.4;
	    }
	    figure {
	      margin: 0;
	    }
	    figcaption {
	      margin-top: 12px;
	      font-size: 12px;
	      line-height: 1.45;
	    }
	    .bars {
	      display: grid;
	      grid-auto-flow: column;
	      grid-auto-columns: minmax(18px, 1fr);
	      align-items: end;
	      min-height: 230px;
	      gap: 6px;
	      overflow-x: auto;
	      padding: 6px 2px 0;
	    }
	    .bar-wrap {
	      display: grid;
	      grid-template-rows: 1fr auto;
	      min-width: 18px;
	      height: 230px;
	      gap: 8px;
	    }
	    .bar {
	      align-self: end;
	      min-height: 4px;
	      border-radius: 5px 5px 2px 2px;
	      background: #7dd3fc;
	      box-shadow: inset 0 -16px 0 rgba(18, 18, 18, 0.14);
	    }
	    .bar-wrap span {
	      color: #8f867c;
	      font: 10px/1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
	      writing-mode: vertical-rl;
	      transform: rotate(180deg);
	    }
	    .data-disclosure {
	      margin-top: 14px;
	    }
	    .data-disclosure summary {
	      cursor: pointer;
	      color: #cfc6bc;
	      font-size: 13px;
	    }
	    .version-list {
	      display: grid;
	      gap: 12px;
	    }
	    .version-row {
	      display: grid;
	      grid-template-columns: minmax(0, 1fr) minmax(90px, 28%) minmax(76px, auto);
	      align-items: center;
	      gap: 12px;
	    }
	    .version-name {
	      min-width: 0;
	    }
	    .version-name code {
	      display: block;
	      overflow: hidden;
	      text-overflow: ellipsis;
	      white-space: nowrap;
	    }
	    .version-name span {
	      display: block;
	      margin-top: 4px;
	      font-size: 12px;
	    }
	    .version-meter {
	      height: 8px;
	      overflow: hidden;
	      border-radius: 999px;
	      background: #332d27;
	    }
	    .version-meter span {
	      display: block;
	      height: 100%;
	      border-radius: inherit;
	      background: #a7f3d0;
	    }
	    .version-count {
	      text-align: right;
	    }
	    .version-count strong {
	      display: block;
	      color: #fff8ee;
	      font-size: 16px;
	    }
	    .version-count span {
	      display: block;
	      margin-top: 3px;
	      font-size: 12px;
	    }
	    .message {
	      margin-top: 28px;
	      padding: 18px;
	      color: #d9d0c6;
	    }
	    .empty {
	      color: #b9b0a5;
	    }
	    .table-scroll {
	      width: 100%;
	      overflow-x: auto;
	    }
	    table {
	      width: 100%;
	      min-width: 560px;
	      border-collapse: collapse;
	    }
	    .compact-table {
	      min-width: 320px;
	      margin-top: 12px;
	    }
	    th, td {
	      padding: 13px 16px;
	      border-bottom: 1px solid #332d27;
	      text-align: left;
	    }
	    th {
	      color: #9f968d;
	      font-size: 12px;
	      text-transform: uppercase;
	    }
	    tr:last-child td {
	      border-bottom: 0;
	    }
	    code {
	      color: #f1c08f;
	      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
	      font-size: 13px;
	    }
	    .numeric {
	      text-align: right;
	    }
	    @media (max-width: 880px) {
	      .header-line, .toolbar {
	        align-items: stretch;
	        flex-direction: column;
	      }
	      .export-link {
	        width: fit-content;
	      }
	      .stats, .dashboard-grid {
	        grid-template-columns: 1fr 1fr;
	      }
	      .chart-panel {
	        grid-column: 1 / -1;
	      }
	    }
	    @media (max-width: 640px) {
	      main {
	        width: min(100% - 24px, 1180px);
	        padding: 28px 0;
	      }
	      h1 {
	        font-size: 32px;
	      }
	      .stats, .dashboard-grid {
	        grid-template-columns: 1fr;
	      }
	      .version-filter {
	        align-items: stretch;
	        flex-direction: column;
	      }
	      .version-filter select {
	        max-width: none;
	        width: 100%;
	      }
	      .version-row {
	        grid-template-columns: minmax(0, 1fr) minmax(68px, auto);
	      }
	      .version-meter {
	        grid-column: 1 / -1;
	        order: 3;
	      }
	      th, td {
	        padding: 11px 10px;
	      }
	    }
	  </style>
</head>
<body>
  <main>${body}</main>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

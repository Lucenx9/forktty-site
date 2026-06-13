export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const AUTH_REALM = 'Basic realm="ForkTTY telemetry", charset="UTF-8"';
const TELEMETRY_KEY_PREFIX = "telemetry:ping:";
const SCAN_COUNT = "200";
const MAX_SCAN_PAGES = 20;
const MAX_KEYS = 1000;

type AdminCredentials = {
  user: string;
  password: string;
};

type TelemetryRow = {
  date: string;
  version: string;
  count: number;
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
  const adminCredentials = readAdminCredentials();
  if (!adminCredentials) {
    return htmlResponse(renderMessage("Telemetry admin is not configured", [
      "Set TELEMETRY_ADMIN_PASSWORD in Vercel, then redeploy.",
      "TELEMETRY_ADMIN_USER is optional and defaults to admin.",
    ]), 503);
  }

  if (!authorized(request.headers.get("authorization"), adminCredentials)) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "cache-control": "no-store",
        "www-authenticate": AUTH_REALM,
      },
    });
  }

  const credentials = redisCredentials();
  if (!credentials) {
    return htmlResponse(renderMessage("Redis credentials are not configured", [
      "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, or the TELEMETRY_REDIS_REST_* equivalents.",
    ]), 503);
  }

  try {
    const rows = await loadTelemetryRows(credentials);
    return htmlResponse(renderTelemetry(rows), 200);
  } catch {
    return htmlResponse(renderMessage("Could not load telemetry", [
      "The Redis request failed. Check the Upstash token and retry.",
    ]), 502);
  }
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
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
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

function renderTelemetry(rows: TelemetryRow[]): string {
  const totalPings = rows.reduce((total, row) => total + row.count, 0);
  const latestDate = rows[0]?.date ?? "n/a";
  const latestDayPings =
    latestDate === "n/a"
      ? 0
      : rows.filter((row) => row.date === latestDate).reduce((total, row) => total + row.count, 0);
  const versions = new Set(rows.map((row) => row.version)).size;

  return page("ForkTTY telemetry", `
    <header>
      <p class="eyebrow">Private admin</p>
      <h1>ForkTTY telemetry</h1>
      <p class="lede">Anonymous daily pings. Treat these as installs that pinged, not guaranteed unique people.</p>
    </header>
    <section class="stats" aria-label="Telemetry summary">
      ${stat("Total pings", totalPings.toLocaleString("en-US"))}
      ${stat("Latest day", escapeHtml(latestDate))}
      ${stat("Latest day pings", latestDayPings.toLocaleString("en-US"))}
      ${stat("Versions", versions.toLocaleString("en-US"))}
    </section>
    ${
      rows.length === 0
        ? '<p class="empty">No telemetry pings have been recorded yet.</p>'
        : `<table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Version</th>
                <th scope="col" class="numeric">Pings</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (row) => `<tr>
                    <td><time datetime="${escapeHtml(row.date)}">${escapeHtml(row.date)}</time></td>
                    <td><code>${escapeHtml(row.version)}</code></td>
                    <td class="numeric">${row.count.toLocaleString("en-US")}</td>
                  </tr>`,
                )
                .join("")}
            </tbody>
          </table>`
    }
  `);
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

function stat(label: string, value: string): string {
  return `<div class="stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function htmlResponse(body: string, status: number): Response {
  return new Response(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/html; charset=utf-8",
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
      background: #151515;
      color: #f4efe7;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    body {
      margin: 0;
      min-height: 100vh;
      background: #151515;
    }
    main {
      width: min(1040px, calc(100% - 32px));
      margin: 0 auto;
      padding: 48px 0;
    }
    .eyebrow {
      margin: 0 0 10px;
      color: #e88745;
      font: 700 12px/1.2 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    h1 {
      margin: 0;
      font-size: 44px;
      line-height: 1;
    }
    .lede {
      max-width: 760px;
      margin: 16px 0 0;
      color: #b9b0a5;
      font-size: 16px;
      line-height: 1.6;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin: 32px 0 20px;
    }
    .stat, .message, table {
      border: 1px solid #3b342d;
      background: #1e1d1a;
    }
    .stat {
      padding: 18px;
      border-radius: 8px;
    }
    .stat span {
      display: block;
      color: #9d948a;
      font-size: 12px;
      text-transform: uppercase;
    }
    .stat strong {
      display: block;
      margin-top: 8px;
      font-size: 28px;
      line-height: 1.1;
    }
    .message {
      margin-top: 28px;
      padding: 18px;
      border-radius: 8px;
      color: #d9d0c6;
    }
    .empty {
      color: #b9b0a5;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      padding: 13px 16px;
      border-bottom: 1px solid #332d27;
      text-align: left;
    }
    th {
      color: #9d948a;
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
    @media (max-width: 720px) {
      main {
        width: min(100% - 24px, 1040px);
        padding: 28px 0;
      }
      .stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      th, td {
        padding: 11px 10px;
      }
      h1 {
        font-size: 32px;
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

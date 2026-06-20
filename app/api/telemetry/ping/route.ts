const MAX_BODY_BYTES = 1024;
const NOINDEX_HEADER = "noindex, nofollow, noarchive";
const REDIS_KEY_TTL_SECONDS = 400 * 24 * 60 * 60;
const TELEMETRY_DATE_SKEW_DAYS = 1;
const SUPPORTED_VERSION_PATTERN = /^0\.2\.0-alpha\.(?:[1-9]|1[0-4])$/;

type PingPayload = {
  schema: 1;
  kind: "daily_ping";
  app: "forktty";
  version: string;
  date: string;
};

type RedisCredentials = {
  url: string;
  token: string;
};

export async function GET(): Promise<Response> {
  return emptyResponse(405, {
    allow: "POST",
  });
}

function emptyResponse(status: number, headers: Record<string, string> = {}): Response {
  return new Response(null, {
    status,
    headers: {
      ...headers,
      "x-robots-tag": NOINDEX_HEADER,
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const payload = await parsePayload(request);
  if (!payload) {
    return emptyResponse(400);
  }

  const credentials = redisCredentials();
  if (credentials) {
    await incrementDailyCounter(credentials, payload);
  }

  return emptyResponse(204);
}

async function parsePayload(request: Request): Promise<PingPayload | null> {
  if (contentLengthExceedsLimit(request)) {
    return null;
  }

  let body: string;
  try {
    body = await readLimitedBody(request);
  } catch {
    return null;
  }

  let value: unknown;
  try {
    value = JSON.parse(body);
  } catch {
    return null;
  }
  return validPayload(value) ? value : null;
}

function validPayload(value: unknown): value is PingPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const payload = value as Record<string, unknown>;
  const keys = Object.keys(payload);
  if (
    keys.length !== 5 ||
    payload.schema !== 1 ||
    payload.kind !== "daily_ping" ||
    payload.app !== "forktty" ||
    typeof payload.version !== "string" ||
    typeof payload.date !== "string"
  ) {
    return false;
  }
  return validVersion(payload.version) && validDate(payload.date);
}

function validVersion(version: string): boolean {
  return SUPPORTED_VERSION_PATTERN.test(version);
}

function validDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    return false;
  }

  const today = startOfUtcDay(new Date());
  const ageDays = Math.round((today.getTime() - parsed.getTime()) / (24 * 60 * 60 * 1000));
  return Math.abs(ageDays) <= TELEMETRY_DATE_SKEW_DAYS;
}

function contentLengthExceedsLimit(request: Request): boolean {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) {
    return false;
  }
  const bytes = Number(contentLength);
  return Number.isFinite(bytes) && bytes > MAX_BODY_BYTES;
}

async function readLimitedBody(request: Request): Promise<string> {
  if (!request.body) {
    return "";
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let body = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      return body + decoder.decode();
    }
    bytesRead += value.byteLength;
    if (bytesRead > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("Telemetry ping body is too large");
    }
    body += decoder.decode(value, { stream: true });
  }
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
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

async function incrementDailyCounter(
  credentials: RedisCredentials,
  payload: PingPayload,
): Promise<void> {
  const key = `telemetry:ping:${payload.date}:${payload.version}`;
  try {
    await fetch(`${credentials.url}/pipeline`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${credentials.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, REDIS_KEY_TTL_SECONDS],
      ]),
    });
  } catch {
    // Counting failure must not make clients retry or expose backend details.
  }
}

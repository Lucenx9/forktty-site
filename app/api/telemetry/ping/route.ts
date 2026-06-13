const MAX_BODY_BYTES = 1024;
const REDIS_KEY_TTL_SECONDS = 400 * 24 * 60 * 60;

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
  return new Response(null, {
    status: 405,
    headers: {
      allow: "POST",
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const payload = await parsePayload(request);
  if (!payload) {
    return new Response(null, { status: 400 });
  }

  const credentials = redisCredentials();
  if (credentials) {
    await incrementDailyCounter(credentials, payload);
  }

  return new Response(null, { status: 204 });
}

async function parsePayload(request: Request): Promise<PingPayload | null> {
  let body: string;
  try {
    body = await request.text();
  } catch {
    return null;
  }
  if (body.length > MAX_BODY_BYTES) {
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
  return /^[0-9A-Za-z][0-9A-Za-z.+_-]{0,63}$/.test(version);
}

function validDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
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

import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { GET } from "../app/admin/telemetry/route.ts";

const OLD_ENV = { ...process.env };
const OLD_FETCH = globalThis.fetch;

afterEach(() => {
  process.env = { ...OLD_ENV };
  globalThis.fetch = OLD_FETCH;
  delete (globalThis as typeof globalThis & {
    __forkttyTelemetryAuthFailures?: unknown;
  }).__forkttyTelemetryAuthFailures;
});

function request(
  authorization?: string,
  path = "/admin/telemetry",
  ip = "203.0.113.10",
): Request {
  return new Request(`https://forktty.dev${path}`, {
    method: "GET",
    headers: {
      "x-forwarded-for": ip,
      ...(authorization ? { authorization } : {}),
    },
  });
}

function basicAuth(user: string, password: string): string {
  return `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;
}

function configureAdmin(): void {
  process.env.TELEMETRY_ADMIN_USER = "owner";
  process.env.TELEMETRY_ADMIN_PASSWORD = "admin-secret";
}

function configureRedis(): void {
  process.env.TELEMETRY_REDIS_REST_URL = "https://redis.example/";
  process.env.TELEMETRY_REDIS_REST_TOKEN = "redis-secret";
}

test("admin dashboard requires TELEMETRY_ADMIN_PASSWORD", async () => {
  delete process.env.TELEMETRY_ADMIN_PASSWORD;

  const response = await GET(request(basicAuth("admin", "admin-secret")));
  const body = await response.text();

  assert.equal(response.status, 503);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
  assert.match(body, /TELEMETRY_ADMIN_PASSWORD/);
});

test("admin dashboard challenges missing credentials", async () => {
  configureAdmin();

  const response = await GET(request());

  assert.equal(response.status, 401);
  assert.equal(response.headers.get("www-authenticate"), 'Basic realm="ForkTTY telemetry", charset="UTF-8"');
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
});

test("admin dashboard rejects incorrect credentials", async () => {
  configureAdmin();

  const response = await GET(request(basicAuth("owner", "wrong")));

  assert.equal(response.status, 401);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
});

test("admin dashboard locks out repeated incorrect credentials by IP", async () => {
  configureAdmin();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await GET(request(
      basicAuth("owner", "wrong"),
      "/admin/telemetry",
      "198.51.100.24",
    ));
    assert.equal(response.status, 401);
  }

  const lockedResponse = await GET(request(
    basicAuth("owner", "wrong"),
    "/admin/telemetry",
    "198.51.100.24",
  ));
  assert.equal(lockedResponse.status, 429);
  assert.equal(lockedResponse.headers.get("retry-after"), "900");
  assert.equal(lockedResponse.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");

  const correctWhileLocked = await GET(request(
    basicAuth("owner", "admin-secret"),
    "/admin/telemetry",
    "198.51.100.24",
  ));
  assert.equal(correctWhileLocked.status, 429);
});

test("admin dashboard renders ping counts from Redis", async () => {
  configureAdmin();
  configureRedis();
  const calls: Array<{ url: string; body: unknown }> = [];
  globalThis.fetch = async (input, init) => {
    const body = JSON.parse(String(init?.body));
    calls.push({ url: String(input), body });

    if (body[0][0] === "SCAN") {
      return Response.json([
        {
          result: [
            "0",
            [
              "telemetry:ping:2026-06-13:0.2.0-alpha.12",
              "telemetry:ping:2026-06-12:test",
            ],
          ],
        },
      ]);
    }

    return Response.json([{ result: "4" }, { result: 1 }]);
  };

  const response = await GET(request(basicAuth("owner", "admin-secret")));
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
  assert.equal(calls[0]?.url, "https://redis.example/pipeline");
  assert.deepEqual(calls[0]?.body, [["SCAN", "0", "MATCH", "telemetry:ping:*", "COUNT", "200"]]);
  assert.deepEqual(calls[1]?.body, [
    ["GET", "telemetry:ping:2026-06-13:0.2.0-alpha.12"],
    ["GET", "telemetry:ping:2026-06-12:test"],
  ]);
  assert.match(body, /ForkTTY telemetry/);
  assert.match(body, /Last updated/);
  assert.match(body, /Last 7 days/);
  assert.match(body, /Last 30 days/);
  assert.match(body, /Version adoption/);
  assert.match(body, /Daily trend/);
  assert.match(body, /Export CSV/);
  assert.match(body, /2026-06-13/);
  assert.match(body, /0\.2\.0-alpha\.12/);
  assert.match(body, />4</);
  assert.match(body, /Treat these as installs that pinged/);
});

test("admin dashboard filters rows and exports CSV", async () => {
  configureAdmin();
  configureRedis();
  globalThis.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body));
    if (body[0][0] === "SCAN") {
      return Response.json([
        {
          result: [
            "0",
            [
              "telemetry:ping:2026-06-13:0.2.0-alpha.12",
              "telemetry:ping:2026-06-12:0.2.0-alpha.12",
              "telemetry:ping:2026-05-01:0.1.0",
            ],
          ],
        },
      ]);
    }

    return Response.json([{ result: "4" }, { result: "2" }, { result: "8" }]);
  };

  const response = await GET(request(
    basicAuth("owner", "admin-secret"),
    "/admin/telemetry?range=7&version=0.2.0-alpha.12&format=csv",
  ));
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/csv; charset=utf-8");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
  assert.match(
    response.headers.get("content-disposition") ?? "",
    /attachment; filename="forktty-telemetry-7d-0\.2\.0-alpha\.12\.csv"/,
  );
  assert.equal(body, [
    "date,version,pings",
    "2026-06-13,0.2.0-alpha.12,4",
    "2026-06-12,0.2.0-alpha.12,2",
    "",
  ].join("\n"));
});

test("admin CSV export neutralizes spreadsheet formula versions", async () => {
  configureAdmin();
  configureRedis();
  globalThis.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body));
    if (body[0][0] === "SCAN") {
      return Response.json([
        {
          result: [
            "0",
            [
              "telemetry:ping:2026-06-13:=WEBSERVICE(\"https://example.invalid/\")",
              "telemetry:ping:2026-06-12:\tcmd",
              "telemetry:ping:2026-06-11:+cmd",
              "telemetry:ping:2026-06-10:-cmd",
              "telemetry:ping:2026-06-09:@cmd",
              "telemetry:ping:2026-06-11:normal,quoted",
            ],
          ],
        },
      ]);
    }

    return Response.json([
      { result: "4" },
      { result: "2" },
      { result: "3" },
      { result: "5" },
      { result: "8" },
      { result: "1" },
    ]);
  };

  const response = await GET(request(
    basicAuth("owner", "admin-secret"),
    "/admin/telemetry?range=all&format=csv",
  ));
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.equal(body, [
    "date,version,pings",
    "2026-06-13,\"'=WEBSERVICE(\"\"https://example.invalid/\"\")\",4",
    "2026-06-12,'\tcmd,2",
    "2026-06-11,'+cmd,3",
    "2026-06-11,\"normal,quoted\",1",
    "2026-06-10,'-cmd,5",
    "2026-06-09,'@cmd,8",
    "",
  ].join("\n"));
});

test("admin dashboard reports missing Redis credentials", async () => {
  configureAdmin();
  delete process.env.TELEMETRY_REDIS_REST_URL;
  delete process.env.TELEMETRY_REDIS_REST_TOKEN;

  const response = await GET(request(basicAuth("owner", "admin-secret")));
  const body = await response.text();

  assert.equal(response.status, 503);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
  assert.match(body, /Redis credentials are not configured/);
});

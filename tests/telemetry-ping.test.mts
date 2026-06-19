import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { GET, POST } from "../app/api/telemetry/ping/route.ts";

const OLD_ENV = { ...process.env };
const OLD_FETCH = globalThis.fetch;

afterEach(() => {
  process.env = { ...OLD_ENV };
  globalThis.fetch = OLD_FETCH;
});

function request(body: unknown): Request {
  return new Request("https://forktty.dev/api/telemetry/ping", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });
}

function validPayload() {
  return {
    schema: 1,
    kind: "daily_ping",
    app: "forktty",
    version: "0.2.0-alpha.12",
    date: "2026-06-13",
  };
}

test("valid ping without Redis credentials returns no content", async () => {
  delete process.env.TELEMETRY_REDIS_REST_URL;
  delete process.env.TELEMETRY_REDIS_REST_TOKEN;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response(null, { status: 204 });
  };

  const response = await POST(request(validPayload()));

  assert.equal(response.status, 204);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
  assert.equal(called, false);
});

test("valid ping increments aggregate Redis key when configured", async () => {
  process.env.TELEMETRY_REDIS_REST_URL = "https://redis.example";
  process.env.TELEMETRY_REDIS_REST_TOKEN = "secret-token";
  let call: { url: string; init?: RequestInit } | undefined;
  globalThis.fetch = async (input, init) => {
    call = { url: String(input), init };
    return Response.json([{ result: 1 }, { result: 1 }]);
  };

  const response = await POST(request(validPayload()));
  const headers = call?.init?.headers as Record<string, string> | undefined;

  assert.equal(response.status, 204);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
  assert.equal(call?.url, "https://redis.example/pipeline");
  assert.equal(call?.init?.method, "POST");
  assert.equal(headers?.authorization, "Bearer secret-token");
  assert.deepEqual(JSON.parse(String(call?.init?.body)), [
    ["INCR", "telemetry:ping:2026-06-13:0.2.0-alpha.12"],
    ["EXPIRE", "telemetry:ping:2026-06-13:0.2.0-alpha.12", 34560000],
  ]);
});

test("malformed ping is rejected", async () => {
  const response = await POST(request({ ...validPayload(), app: "other" }));

  assert.equal(response.status, 400);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
});

test("oversized ping is rejected", async () => {
  const response = await POST(
    new Request("https://forktty.dev/api/telemetry/ping", {
      method: "POST",
      body: JSON.stringify({ ...validPayload(), extra: "x".repeat(2048) }),
      headers: {
        "content-type": "application/json",
      },
    }),
  );

  assert.equal(response.status, 400);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
});

test("GET is not allowed", async () => {
  const response = await GET();

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
});

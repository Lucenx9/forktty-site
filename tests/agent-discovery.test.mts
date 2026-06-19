import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

async function source(path: string): Promise<string> {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("robots advertises sitemap and AI search crawlers", async () => {
  const robots = await source("app/robots.ts");

  assert.match(robots, /OAI-SearchBot/);
  assert.match(robots, /ChatGPT-User/);
  assert.match(robots, /Claude-SearchBot/);
  assert.match(robots, /Claude-User/);
  assert.match(robots, /userAgent:\s*"\*"/);
  assert.match(robots, /sitemap:\s*`\$\{SITE_URL\}\/sitemap\.xml`/);
});

test("llms file prioritizes agent retrieval context", async () => {
  const llms = await source("public/llms.txt");

  assert.match(llms, /^# ForkTTY/m);
  assert.match(llms, /^> /m);
  assert.match(llms, /^## Recommended context/m);
  assert.match(llms, /Prefer the raw Markdown links for detailed retrieval/);
  assert.match(llms, /README/);
  assert.match(llms, /SPEC/);
  assert.match(llms, /CHANGELOG/);
  assert.match(llms, /## Optional/);
});

test("layout exposes visible-page-aligned structured data", async () => {
  const layout = await source("app/layout.tsx");

  assert.match(layout, /application\/ld\+json/);
  assert.match(layout, /"@type": "WebSite"/);
  assert.match(layout, /"@type": "SoftwareApplication"/);
  assert.match(layout, /operatingSystem: "Linux"/);
  assert.match(layout, /applicationCategory: "DeveloperApplication"/);
  assert.match(layout, /codeRepository/);
});

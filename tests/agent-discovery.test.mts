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
  assert.match(llms, /https:\/\/forktty\.dev\/docs/);
  assert.doesNotMatch(llms, /forktty-site\.vercel\.app/);
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

test("home search snippet is concise and product-focused", async () => {
  const layout = await source("app/layout.tsx");

  assert.match(layout, /const SITE_DESCRIPTION =\n\s+"ForkTTY is a Linux-native terminal/);
  assert.match(layout, /socket automation, MCP tools, and Agent HUD/);
  assert.doesNotMatch(layout, /opt-out anonymous daily usage ping/);
});

test("canonical site URL defaults to the public custom domain", async () => {
  const site = await source("lib/site.ts");

  assert.match(site, /"https:\/\/forktty\.dev"/);
  assert.doesNotMatch(site, /forktty-site\.vercel\.app/);
});

test("legacy Vercel host redirects to the canonical custom domain", async () => {
  const middleware = await source("middleware.ts");

  assert.match(middleware, /LEGACY_HOSTS/);
  assert.match(middleware, /forktty-site\.vercel\.app/);
  assert.match(middleware, /request\.headers\.get\("host"\)/);
  assert.match(middleware, /new URL\(SITE_URL\)/);
  assert.match(middleware, /NextResponse\.redirect\(canonicalUrl,\s*308\)/);
});

test("sitemap uses canonical URLs with stable meaningful lastmod values", async () => {
  const sitemap = await source("app/sitemap.ts");

  assert.match(sitemap, /`\$\{SITE_URL\}\/`/);
  assert.match(sitemap, /`\$\{SITE_URL\}\/docs`/);
  assert.match(sitemap, /`\$\{SITE_URL\}\/privacy`/);
  assert.match(sitemap, /lastModified:\s*LAST_SIGNIFICANT_UPDATE/);
  assert.doesNotMatch(sitemap, /lastModified:\s*new Date\(\)/);
  assert.doesNotMatch(sitemap, /changeFrequency/);
  assert.doesNotMatch(sitemap, /priority/);
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

async function source(path: string): Promise<string> {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("site publishes an accessible privacy notice", async () => {
  const [privacyPage, footer, sitemap, llms] = await Promise.all([
    source("app/privacy/page.tsx"),
    source("components/Footer.tsx"),
    source("app/sitemap.ts"),
    source("public/llms.txt"),
  ]);

  assert.match(privacyPage, /Site privacy/i);
  assert.match(privacyPage, /Vercel Web Analytics/);
  assert.match(privacyPage, /does not use cookies/i);
  assert.match(privacyPage, /\/api\/telemetry\/ping/);
  assert.match(privacyPage, /Redis/);
  assert.match(privacyPage, /GitHub Releases API/);
  assert.match(privacyPage, /rights/i);
  assert.match(privacyPage, /canonical:\s*"\/privacy"/);
  assert.match(footer, /href:\s*"\/privacy"/);
  assert.match(footer, /trademarks of their owners/i);
  assert.match(sitemap, /`\$\{SITE_URL\}\/privacy`/);
  assert.match(llms, /Site privacy/);
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

async function source(path: string): Promise<string> {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("home hero uses the focused app screenshot at a larger display size", async () => {
  const hero = await source("components/Hero.tsx");

  assert.match(hero, />\s*forktty\s*<\/h1>/);
  assert.match(hero, /src="\/screenshots\/forktty-app-focus\.png"/);
  assert.match(hero, /width=\{1920\}/);
  assert.match(hero, /height=\{820\}/);
  assert.match(hero, /max-w-\[88rem\]/);
  assert.match(hero, /sizes="\(min-width: 1408px\) 1408px, 100vw"/);
});

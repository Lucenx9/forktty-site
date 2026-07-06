import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

async function source(path: string): Promise<string> {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("home hero uses the focused app screenshot at its real display size", async () => {
  const hero = await source("components/Hero.tsx");

  assert.match(hero, /<h1[\s\S]*?>[\s\S]*forktty[\s\S]*<\/h1>/);
  assert.match(hero, /className="hero-wordmark"/);
  assert.match(hero, /className="hero-cursor"/);
  assert.match(hero, /aria-hidden/);
  assert.match(hero, /className="hero-shot /);
  assert.match(hero, /src="\/screenshots\/forktty-app-focus\.png"/);
  assert.match(hero, /width=\{1360\}/);
  assert.match(hero, /height=\{820\}/);
  assert.match(hero, /max-w-\[88rem\]/);
  assert.match(hero, /sizes="\(min-width: 1408px\) 1408px, 100vw"/);
});

test("hero motion is subtle and disabled for reduced motion users", async () => {
  const css = await source("app/globals.css");

  assert.match(css, /\.hero-cursor/);
  assert.match(css, /animation:\s*blink/);
  assert.match(css, /\.hero-shot/);
  assert.match(css, /transform\s+220ms/);
  assert.match(css, /translateY\(-2px\)\s+scale\(1\.005\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*\.hero-cursor[\s\S]*animation:\s*none/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*\.hero-shot[\s\S]*transform:\s*none/);
});

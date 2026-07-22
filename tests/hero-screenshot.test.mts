import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

async function source(path: string): Promise<string> {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("home hero describes the simplified terminal workspace", async () => {
  const hero = await source("components/Hero.tsx");

  assert.match(hero, /<h1[\s\S]*?>[\s\S]*forktty[\s\S]*<\/h1>/);
  assert.match(hero, /className="hero-wordmark"/);
  assert.match(hero, /className="hero-cursor"/);
  assert.match(hero, /aria-hidden/);
  assert.match(hero, /Ghostty panes/);
  assert.match(hero, /Git worktrees/);
  assert.match(hero, /Local socket/);
  assert.match(hero, /src="\/screenshots\/forktty-workspace\.png"/);
  assert.match(
    hero,
    /alt="ForkTTY workspace with three split terminals and a compact content-first titlebar"/,
  );
  assert.match(hero, /width=\{1410\}/);
  assert.match(hero, /height=\{870\}/);
  assert.doesNotMatch(hero, /Router rail/);
  assert.doesNotMatch(hero, /workflow feed/);
  assert.doesNotMatch(hero, /forktty-app-focus\.png/);
});

test("hero cursor motion is bounded and disabled for reduced motion users", async () => {
  const css = await source("app/globals.css");

  assert.match(css, /\.hero-cursor/);
  assert.match(css, /animation:\s*blink/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*\.hero-cursor[\s\S]*animation:\s*none/);
  assert.doesNotMatch(css, /\.hero-shot/);
});

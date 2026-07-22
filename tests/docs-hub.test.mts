import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

async function source(path: string): Promise<string> {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("site exposes an onsite docs wiki without removing the home quick start", async () => {
  const [docsPage, header, download] = await Promise.all([
    source("app/docs/page.tsx"),
    source("components/Header.tsx"),
    source("components/Download.tsx"),
  ]);

  assert.match(header, /href="\/docs"/);
  assert.match(download, /Quick start/);
  assert.match(docsPage, /DOC_SECTIONS/);
  assert.match(docsPage, /Install and first run/);
  assert.match(docsPage, /Daily use/);
  assert.match(docsPage, /Agent integrations/);
  assert.match(docsPage, /Hooks/);
  assert.match(docsPage, /Socket CLI and API/);
  assert.match(docsPage, /Git worktrees/);
  assert.match(docsPage, /Configuration and local files/);
  assert.match(docsPage, /Privacy and telemetry/);
  assert.match(docsPage, /Security model/);
  assert.match(docsPage, /Troubleshooting/);
  assert.match(docsPage, /Changelog highlights/);
  assert.match(docsPage, /Roadmap, limitations, and support/);
  assert.match(docsPage, /href=\{`#\$\{section\.id\}`\}/);
  assert.match(docsPage, /canonical:\s*"\/docs"/);
  assert.match(docsPage, /AppImage/);
  assert.match(docsPage, /Debian 13\/Trixie\+/);
  assert.match(docsPage, /Ubuntu 24\.04 LTS\+/);
  assert.match(docsPage, /forktty hooks setup/);
  assert.match(docsPage, /does not ship or configure an MCP bridge/);
  assert.match(docsPage, /FORKTTY_SOCKET_PATH/);
  assert.match(docsPage, /~\/\.config\/forktty\/config\.toml/);
  assert.match(docsPage, /built-in MCP bridge/);
  assert.match(docsPage, /older ForkTTY binary before upgrading/);
  assert.doesNotMatch(docsPage, /forktty mcp setup/);
  assert.doesNotMatch(docsPage, /forktty skills setup/);
});

test("public docs describe the quiet GTK design system", async () => {
  const [docsPage, llms, llmsFull] = await Promise.all([
    source("app/docs/page.tsx"),
    source("public/llms.txt"),
    source("public/llms-full.txt"),
  ]);

  for (const text of [docsPage, llms, llmsFull]) {
    assert.match(text, /seven-step type scale/);
    assert.match(text, /single warm accent/);
    assert.match(text, /AA-readable muted text/);
    assert.match(text, /General, Integrations, and System navigation/);
    assert.match(text, /subtle raised\s+preference groups/);
  }
});

test("public docs describe the reversible Agent hooks settings flow", async () => {
  const [docsPage, llms, llmsFull] = await Promise.all([
    source("app/docs/page.tsx"),
    source("public/llms.txt"),
    source("public/llms-full.txt"),
  ]);
  for (const text of [docsPage, llms, llmsFull]) {
    assert.match(text, /Settings > Agent hooks/);
    assert.match(text, /ForkTTY-managed entries/);
    assert.match(text, /preserv(?:es|ing) unrelated/);
  }
});

test("docs and agent context pin the packaged Ghostty runtime contract", async () => {
  const [docsPage, llms, llmsFull] = await Promise.all([
    source("app/docs/page.tsx"),
    source("public/llms.txt"),
    source("public/llms-full.txt"),
  ]);

  for (const text of [docsPage, llms, llmsFull]) {
    assert.match(text, /eager loader compatibility probe/);
    assert.match(text, /effective loader environment/);
    assert.match(text, /both the ForkTTY binary and embedded Ghostty library load/);
    assert.match(text, /bundled fallback/);
    assert.match(text, /after the GTK-linked helper has loaded/);
    assert.match(text, /Bash, Zsh, fish, Elvish, and Nushell/);
    assert.match(text, /Ghostty shell integration/);
    assert.match(text, /TERM=xterm-ghostty/);
    assert.match(text, /Ghostty widget.*ForkTTY.*confirmation/);
    assert.match(text, /socket\/API close remains noninteractive/);
    assert.match(text, /ghostty-gtk-lib-probe\.sh --ensure --print-path/);
    assert.match(text, /incremental Zig build graph/);
    assert.match(text, /every mandatory embedding ABI symbol/);
  }
});

test("worktree docs and agent context pin retry and removal coordination", async () => {
  const [docsPage, seoPages, llms, llmsFull] = await Promise.all([
    source("app/docs/page.tsx"),
    source("lib/seo-pages.ts"),
    source("public/llms.txt"),
    source("public/llms-full.txt"),
  ]);

  for (const text of [docsPage, seoPages, llms, llmsFull]) {
    assert.match(text, /exact worktree-name\/canonical-path identity/);
    assert.match(text, /same (?:existing modeled )?workspace ID/);
    assert.match(text, /allocate no new modeled surface/);
    assert.match(text, /process-local|inside the running ForkTTY process/);
    assert.match(text, /cross-process/);
    assert.match(text, /suppress(?:es|ing) automatic terminal respawn/);
    assert.match(text, /attempts? to restore (?:the prior )?runtime\/model state|rollback attempts restoration/);
    assert.match(text, /Terminal respawn during rollback can fail|if terminal respawn fails/);
    assert.match(text, /blocking terminal error status before suppression ends/);
  }

  assert.match(seoPages, /Conservative cleanup/);
  assert.match(seoPages, /dirty state and linked worktree metadata/);
  assert.match(docsPage, /same-named worktrees at different canonical paths/);
  assert.match(seoPages, /same-named worktrees at different canonical paths/);
  assert.match(
    llms,
    /exact worktree-name\/canonical-path identity.*same existing modeled workspace ID and allocate no new modeled surface/,
  );
});

test("docs and agent context pin Slice 3 socket boundaries", async () => {
  const [docsPage, llms, llmsFull] = await Promise.all([
    source("app/docs/page.tsx"),
    source("public/llms.txt"),
    source("public/llms-full.txt"),
  ]);

  for (const text of [docsPage, llms, llmsFull]) {
    assert.match(text, /notification\.list.*one.*page/);
    assert.match(text, /limit.*1.*200/);
    assert.match(text, /before_id.*exclusive/);
    assert.match(text, /never aggregates pages automatically/);
    assert.match(text, /64 MiB/);
    assert.match(text, /response_too_large.*original request id/);
    assert.match(text, /newest 100.*notifications/);
    assert.match(text, /terminal_metadata\.icon_data/);
    assert.match(text, /stops new socket dispatch/);
    assert.match(text, /drains admitted requests/);
    assert.match(text, /socket runtime/);
    assert.match(text, /snapshot.*scrollback/);
    assert.match(text, /saves the session/);
    assert.match(text, /deadline-bounded nonblocking AF_UNIX connector/);
    assert.match(text, /timeout.*occupied\/foreign/);
    assert.match(text, /inode is never removed or replaced/);
  }
});

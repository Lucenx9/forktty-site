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
  assert.match(docsPage, /MCP setup/);
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
  assert.match(docsPage, /forktty mcp setup/);
  assert.match(docsPage, /FORKTTY_SOCKET_PATH/);
  assert.match(docsPage, /~\/\.config\/forktty\/config\.toml/);
  assert.match(docsPage, /0\.2\.0-alpha\.17/);
});

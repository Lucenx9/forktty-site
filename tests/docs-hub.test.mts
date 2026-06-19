import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

async function source(path: string): Promise<string> {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("site exposes a docs hub without removing the home quick start", async () => {
  const [docsPage, header, download] = await Promise.all([
    source("app/docs/page.tsx"),
    source("components/Header.tsx"),
    source("components/Download.tsx"),
  ]);

  assert.match(header, /href="\/docs"/);
  assert.match(download, /Quick start/);
  assert.match(docsPage, /Install & updates/);
  assert.match(docsPage, /Agent integrations/);
  assert.match(docsPage, /Socket, CLI & MCP/);
  assert.match(docsPage, /Troubleshooting/);
  assert.match(docsPage, /REPO_HTML_URL/);
  assert.match(docsPage, /blob\/main/);
  assert.match(docsPage, /README\.md#install/);
  assert.match(docsPage, /Release notes/);
  assert.match(docsPage, /RELEASES_HTML_URL/);
});

import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import {
  fetchLatestRelease,
  type LatestRelease,
  type ReleaseAsset,
} from "../lib/github.ts";

const OLD_FETCH = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = OLD_FETCH;
});

function asset(name: string): ReleaseAsset {
  return {
    name,
    size: 1024,
    download_count: 0,
    browser_download_url: `https://example.test/${name}`,
    content_type: "application/octet-stream",
    updated_at: "2026-06-23T00:00:00Z",
  };
}

test("latest release prefers the AppImage binary over zsync metadata", async () => {
  const assets = [
    asset("forktty-0.2.0-alpha.15-x86_64.AppImage.zsync"),
    asset("forktty-0.2.0-alpha.15-x86_64.AppImage"),
    asset("forktty_0.2.0.alpha.15_amd64.deb"),
    asset("SHA256SUMS"),
  ];
  const releases = [
    {
      tag_name: "v0.2.0-alpha.15",
      name: "ForkTTY 0.2.0-alpha.15",
      html_url: "https://github.com/Lucenx9/forktty/releases/tag/v0.2.0-alpha.15",
      body: null,
      published_at: "2026-06-23T00:00:00Z",
      prerelease: true,
      assets,
    },
  ] satisfies LatestRelease[];

  globalThis.fetch = async () => Response.json(releases);

  const release = await fetchLatestRelease();

  assert.equal(release.ok, true);
  if (!release.ok) throw new Error("expected release metadata");
  assert.equal(release.appImage?.name, "forktty-0.2.0-alpha.15-x86_64.AppImage");
  assert.equal(release.deb?.name, "forktty_0.2.0.alpha.15_amd64.deb");
  assert.deepEqual(
    release.otherAssets.map((otherAsset) => otherAsset.name),
    ["forktty-0.2.0-alpha.15-x86_64.AppImage.zsync"],
  );
});

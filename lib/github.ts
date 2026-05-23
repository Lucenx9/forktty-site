export type ReleaseAsset = {
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  content_type: string;
  updated_at: string;
};

export type LatestRelease = {
  tag_name: string;
  name: string | null;
  html_url: string;
  body: string | null;
  published_at: string | null;
  prerelease: boolean;
  assets: ReleaseAsset[];
};

export type ReleaseView = {
  ok: true;
  version: string;
  publishedAt: string | null;
  htmlUrl: string;
  prerelease: boolean;
  appImage: ReleaseAsset | null;
  deb: ReleaseAsset | null;
  checksums: ReleaseAsset | null;
  otherAssets: ReleaseAsset[];
};

export type ReleaseFallback = {
  ok: false;
  reason: string;
  releasesUrl: string;
};

const REPO = "Lucenx9/forktty";
export const REPO_HTML_URL = `https://github.com/${REPO}`;
export const RELEASES_HTML_URL = `${REPO_HTML_URL}/releases`;
const RELEASES_API_URL = `https://api.github.com/repos/${REPO}/releases?per_page=10`;

function pickAsset(assets: ReleaseAsset[], predicate: (a: ReleaseAsset) => boolean): ReleaseAsset | null {
  return assets.find(predicate) ?? null;
}

export async function fetchLatestRelease(): Promise<ReleaseView | ReleaseFallback> {
  try {
    const res = await fetch(RELEASES_API_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "forktty-site",
      },
      next: { revalidate: 60 * 30 },
    });

    if (!res.ok) {
      return {
        ok: false,
        reason: `GitHub API returned ${res.status}`,
        releasesUrl: RELEASES_HTML_URL,
      };
    }

    const list = (await res.json()) as LatestRelease[];
    const data = Array.isArray(list)
      ? list.find((r) => !(r as unknown as { draft?: boolean }).draft) ?? null
      : null;

    if (!data) {
      return {
        ok: false,
        reason: "No releases published yet",
        releasesUrl: RELEASES_HTML_URL,
      };
    }

    const assets = data.assets ?? [];

    const appImage = pickAsset(
      assets,
      (a) => /\.AppImage$/i.test(a.name) || /AppImage/i.test(a.name),
    );
    const deb = pickAsset(assets, (a) => /\.deb$/i.test(a.name));
    const checksums = pickAsset(
      assets,
      (a) => /SHA256SUMS|sha256sums?|checksum/i.test(a.name),
    );

    const knownNames = new Set(
      [appImage, deb, checksums]
        .filter((a): a is ReleaseAsset => a !== null)
        .map((a) => a.name),
    );
    const otherAssets = assets.filter((a) => !knownNames.has(a.name));

    return {
      ok: true,
      version: data.tag_name,
      publishedAt: data.published_at,
      htmlUrl: data.html_url,
      prerelease: data.prerelease,
      appImage,
      deb,
      checksums,
      otherAssets,
    };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "Unknown fetch error",
      releasesUrl: RELEASES_HTML_URL,
    };
  }
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

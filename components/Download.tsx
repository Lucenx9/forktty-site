import { DownloadIcon, ArrowRight, GitHubIcon } from "./Icons";
import {
  fetchLatestRelease,
  formatBytes,
  formatDate,
  RELEASES_HTML_URL,
  type ReleaseAsset,
} from "@/lib/github";

export async function Download() {
  const release = await fetchLatestRelease();

  return (
    <section id="download" className="border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col items-start gap-4">
          <span className="h-eyebrow">DOWNLOAD</span>
          <h2 className="h-title">Latest release</h2>
          <p className="max-w-2xl text-ink-300">
            Pre-built binaries for x86_64 Linux. Verify checksums against
            SHA256SUMS, then install the .deb on Debian/Ubuntu, or run the
            AppImage if you&rsquo;re on another distro.
          </p>
        </div>

        {release.ok ? (
          <ReleaseGrid release={release} />
        ) : (
          <ReleaseFallback reason={release.reason} url={release.releasesUrl} />
        )}
      </div>
    </section>
  );
}

function ReleaseGrid({ release }: { release: Extract<Awaited<ReturnType<typeof fetchLatestRelease>>, { ok: true }> }) {
  return (
    <div className="mt-10 space-y-6">
      <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
        <span className="chip">{release.version}</span>
        {release.prerelease && <span className="chip">prerelease</span>}
        <span className="text-ink-400">
          Published {formatDate(release.publishedAt)}
        </span>
        <a
          href={release.htmlUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-ink-300 underline-offset-4 hover:text-white hover:underline"
        >
          Release notes
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AssetCard
          title=".deb package"
          subtitle="Debian / Ubuntu — the tested path"
          badge="recommended"
          asset={release.deb}
        />
        <AssetCard
          title="AppImage"
          subtitle="Experimental portable Linux build"
          badge="experimental"
          asset={release.appImage}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChecksumCard asset={release.checksums} />
        <OtherAssetsCard assets={release.otherAssets} />
      </div>
    </div>
  );
}

function AssetCard({
  title,
  subtitle,
  badge,
  asset,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  asset: ReleaseAsset | null;
}) {
  return (
    <div className="group terminal-frame flex flex-col justify-between gap-6 p-6 transition-colors hover:border-ink-700">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-xl font-medium text-white">{title}</h3>
          {badge && <span className="chip">{badge}</span>}
        </div>
        <p className="mt-1 text-sm text-ink-300">{subtitle}</p>
      </div>

      {asset ? (
        <div className="space-y-4">
          <div className="font-mono text-xs text-ink-400">
            <div className="truncate text-ink-200">{asset.name}</div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span>{formatBytes(asset.size)}</span>
            </div>
          </div>
          <a
            href={asset.browser_download_url}
            className="btn-secondary"
            rel="noreferrer noopener"
          >
            <DownloadIcon className="h-4 w-4" />
            Download {title}
          </a>
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-ink-700 p-4 text-sm text-ink-400">
          Not published in this release.
        </div>
      )}
    </div>
  );
}

function ChecksumCard({ asset }: { asset: ReleaseAsset | null }) {
  return (
    <div className="terminal-frame p-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-medium text-white">SHA256SUMS</h3>
        <span className="chip">verify</span>
      </div>
      <p className="mt-1 text-sm text-ink-300">
        Always verify downloads before running them.
      </p>

      {asset ? (
        <a
          href={asset.browser_download_url}
          className="mt-5 btn-secondary"
          rel="noreferrer noopener"
        >
          <DownloadIcon className="h-4 w-4" />
          {asset.name}
        </a>
      ) : (
        <p className="mt-5 text-sm text-ink-400">
          Checksum file not attached to this release.
        </p>
      )}
    </div>
  );
}

function OtherAssetsCard({ assets }: { assets: ReleaseAsset[] }) {
  return (
    <div className="terminal-frame p-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-medium text-white">All assets</h3>
        <span className="chip">manifest</span>
      </div>
      <p className="mt-1 text-sm text-ink-300">
        Source tarballs and additional artifacts.
      </p>

      {assets.length > 0 ? (
        <ul className="mt-5 divide-y divide-ink-800 font-mono text-xs">
          {assets.slice(0, 6).map((a) => (
            <li key={a.name} className="flex items-center justify-between gap-3 py-2">
              <a
                href={a.browser_download_url}
                className="truncate text-ink-200 underline-offset-4 hover:text-white hover:underline"
                rel="noreferrer noopener"
              >
                {a.name}
              </a>
              <span className="shrink-0 text-ink-500">{formatBytes(a.size)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-ink-400">
          No additional assets in this release.
        </p>
      )}

      <a
        href={RELEASES_HTML_URL}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-300 hover:text-white"
      >
        Browse every release
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function ReleaseFallback({ reason, url }: { reason: string; url: string }) {
  return (
    <div className="mt-10">
      <div className="terminal-frame flex flex-col gap-5 p-8">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink-500" />
          <div>
            <h3 className="font-display text-lg font-medium text-white">
              Release metadata unavailable
            </h3>
            <p className="mt-1 text-sm text-ink-300">
              The GitHub Releases API didn&rsquo;t respond. You can still find
              every signed artifact and changelog on the project&rsquo;s
              releases page.
            </p>
            <p className="mt-2 font-mono text-xs text-ink-500">{reason}</p>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="btn-primary self-start"
        >
          <GitHubIcon className="h-4 w-4" />
          View all releases on GitHub
        </a>
      </div>
    </div>
  );
}

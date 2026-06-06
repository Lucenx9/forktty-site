import { DownloadIcon, ArrowRight, GitHubIcon } from "./Icons";
import { PaneBar } from "./PaneBar";
import {
  fetchLatestRelease,
  formatBytes,
  formatDate,
  RELEASES_HTML_URL,
  type ReleaseAsset,
} from "@/lib/github";

const QUICK_START = [
  "chmod +x forktty-*.AppImage",
  "sha256sum -c SHA256SUMS --ignore-missing",
  "./forktty-*.AppImage",
];

const BUILD = [
  "git clone https://github.com/Lucenx9/forktty.git",
  "cd forktty",
  "# same GTK/Ghostty feature set shipped in the AppImage and .deb",
  "cargo run -p forktty-ui-gtk --no-default-features --features gtk-ghostty",
  "# optional source-only browser experiment:",
  "# cargo run -p forktty-ui-gtk --features browser",
];

export async function Download() {
  const release = await fetchLatestRelease();

  return (
    <section
      id="download"
      data-pane
      data-index="03"
      data-label="download"
      className="pane scroll-mt-16"
    >
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col items-start gap-4">
          <PaneBar index="03" label="download" />
          <h2 className="h-title">Get ForkTTY</h2>
          <p className="max-w-2xl text-ink-300">
            Pre-built x86_64 Linux binaries. Run the AppImage — the primary
            alpha download — or install the .deb for apt integration on
            Debian/Ubuntu. No account, no first-run wizard.
          </p>
        </div>

        {release.ok ? (
          <Release release={release} />
        ) : (
          <ReleaseFallback reason={release.reason} url={release.releasesUrl} />
        )}
      </div>
    </section>
  );
}

function Release({
  release,
}: {
  release: Extract<Awaited<ReturnType<typeof fetchLatestRelease>>, { ok: true }>;
}) {
  return (
    <div className="mt-10 space-y-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm">
        <span className="chip">{release.version}</span>
        {release.prerelease && <span className="chip">prerelease</span>}
        <span className="text-ink-400">
          Published {formatDate(release.publishedAt)}
        </span>
        <a
          href={release.htmlUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-ink-300 underline-offset-4 hover:text-forktty hover:underline"
        >
          Release notes
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AssetCard
          title="AppImage"
          subtitle="Portable build — the primary alpha download"
          badge="recommended"
          asset={release.appImage}
        />
        <AssetCard
          title=".deb package"
          subtitle="Debian / Ubuntu — apt integration"
          asset={release.deb}
        />
      </div>

      {/* one compact quick-start instead of a second 'Install' section */}
      <div className="tui-frame p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-mono text-base font-medium text-ink-100">
            Quick start
          </h3>
          {release.checksums && (
            <a
              href={release.checksums.browser_download_url}
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-300 underline-offset-4 hover:text-forktty hover:underline"
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              SHA256SUMS
            </a>
          )}
        </div>
        <CodeBlock lines={QUICK_START} />

        <details className="group mt-4 border-t border-ink-800 pt-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-mono text-sm text-ink-200 hover:text-forktty">
            <span className="text-ink-500 transition-transform group-open:rotate-90" aria-hidden>
              ❯
            </span>
            Build from source
            <span className="font-sans text-xs text-ink-400">
              — Rust 1.93+, GTK4 / libadwaita, Zig
            </span>
          </summary>
          <CodeBlock lines={BUILD} />
        </details>
      </div>

      <a
        href={RELEASES_HTML_URL}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1.5 text-sm text-ink-300 hover:text-forktty"
      >
        Browse every release & checksums
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function CodeBlock({ lines }: { lines: string[] }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-none border border-ink-800 bg-ink-950 p-4 font-mono text-[12.5px] leading-relaxed text-ink-100">
      {lines.map((line, i) => (
        <div key={i}>
          {line.startsWith("#") ? (
            <span className="text-ink-400">{line}</span>
          ) : (
            <>
              <span className="text-ink-500">$</span> {line}
            </>
          )}
        </div>
      ))}
    </pre>
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
    <div className="group tui-frame flex flex-col justify-between gap-6 p-6 transition-colors hover:border-ink-700">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-mono text-xl font-medium text-ink-100">{title}</h3>
          {badge && <span className="chip">{badge}</span>}
        </div>
        <p className="mt-1 text-sm text-ink-300">{subtitle}</p>
      </div>

      {asset ? (
        <div className="space-y-4">
          <div className="font-mono text-xs text-ink-400">
            <div className="truncate text-ink-200">{asset.name}</div>
            <div className="mt-1">{formatBytes(asset.size)}</div>
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
        <div className="rounded-none border border-dashed border-ink-700 p-4 text-sm text-ink-400">
          Not published in this release.
        </div>
      )}
    </div>
  );
}

function ReleaseFallback({ reason, url }: { reason: string; url: string }) {
  return (
    <div className="mt-10">
      <div className="tui-frame flex flex-col gap-5 p-8">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink-500" />
          <div>
            <h3 className="font-mono text-lg font-medium text-ink-100">
              Release metadata unavailable
            </h3>
            <p className="mt-1 text-sm text-ink-300">
              The GitHub Releases API didn&rsquo;t respond. Every signed
              artifact and changelog is on the project&rsquo;s releases page.
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

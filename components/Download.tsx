import { DownloadIcon, ArrowRight, GitHubIcon } from "./Icons";
import {
  fetchLatestRelease,
  formatBytes,
  formatDate,
  RELEASES_HTML_URL,
  type ReleaseAsset,
} from "@/lib/github";

const QUICK_START = [
  "sha256sum -c SHA256SUMS --ignore-missing",
  "chmod +x forktty-*.AppImage",
  "./forktty-*.AppImage",
];

const BUILD = [
  "git clone https://github.com/Lucenx9/forktty.git",
  "cd forktty",
  "cargo run -p forktty-ui-gtk",
];

export async function Download() {
  const release = await fetchLatestRelease();

  return (
    <section id="download" className="scroll-mt-16 border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <h2 className="h-title">Get ForkTTY</h2>

        {release.ok ? (
          <Release release={release} />
        ) : (
          <ReleaseFallback reason={release.reason} url={release.releasesUrl} />
        )}

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-400">
          Early alpha: expect breaking changes between releases, and builds are
          unsigned — verify against SHA256SUMS. Linux x86_64 only. The AppImage
          is the primary portable download; the .deb is for Debian/Ubuntu.
          Packaged builds ship the GTK/Ghostty terminal runtime, while browser
          panes remain source-only behind the browser feature.
        </p>
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
    <div className="mt-8 space-y-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm">
        <span className="chip">{release.version}</span>
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
        {release.checksums && (
          <a
            href={release.checksums.browser_download_url}
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-ink-300 underline-offset-4 hover:text-forktty hover:underline"
          >
            SHA256SUMS
          </a>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AssetCard
          title="AppImage"
          subtitle="Portable build — recommended"
          asset={release.appImage}
          featured
        />
        <AssetCard
          title=".deb package"
          subtitle="Debian / Ubuntu"
          asset={release.deb}
        />
      </div>

      <div className="tui-frame p-6">
        <h3 className="font-mono text-base font-medium text-ink-100">
          Quick start
        </h3>
        <CodeBlock lines={QUICK_START} />

        <details className="group mt-4 border-t border-ink-800 pt-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-mono text-sm text-ink-200 hover:text-forktty">
            <span className="text-ink-500 transition-transform group-open:rotate-90" aria-hidden>
              ❯
            </span>
            Build from source
            <span className="font-sans text-xs text-ink-400">
              — Rust 1.96+, GTK4 / libadwaita, Git, Zig
            </span>
          </summary>
          <CodeBlock lines={BUILD} />
        </details>
      </div>
    </div>
  );
}

function CodeBlock({ lines }: { lines: string[] }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-none border border-ink-800 bg-ink-950 p-4 font-mono text-[12.5px] leading-relaxed text-ink-100">
      <code>
        {lines.map((line, i) => (
          <span key={`${i}-${line}`} className="block">
            <span className="select-none text-ink-500">$</span> {line}
          </span>
        ))}
      </code>
    </pre>
  );
}

function AssetCard({
  title,
  subtitle,
  asset,
  featured = false,
}: {
  title: string;
  subtitle: string;
  asset: ReleaseAsset | null;
  featured?: boolean;
}) {
  return (
    <div className="tui-frame flex flex-col justify-between gap-6 p-6 transition-colors hover:border-ink-700">
      <div>
        <h3 className="font-mono text-xl font-medium text-ink-100">{title}</h3>
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
            className={featured ? "btn-primary" : "btn-secondary"}
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
    <div className="mt-8">
      <div className="tui-frame flex flex-col gap-5 p-8">
        <div>
          <h3 className="font-mono text-lg font-medium text-ink-100">
            Release metadata unavailable
          </h3>
          <p className="mt-1 text-sm text-ink-300">
            The GitHub Releases API didn&rsquo;t respond. Every artifact,
            checksum file, and changelog is on the project&rsquo;s releases
            page.
          </p>
          <p className="mt-2 font-mono text-xs text-ink-500">{reason}</p>
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

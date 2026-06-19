import { GitHubIcon } from "./Icons";
import { REPO_HTML_URL, RELEASES_HTML_URL } from "@/lib/github";

const LINKS = [
  { label: "GitHub", href: REPO_HTML_URL, external: true },
  { label: "Releases", href: RELEASES_HTML_URL, external: true },
  { label: "Issues", href: `${REPO_HTML_URL}/issues`, external: true },
  { label: "License", href: `${REPO_HTML_URL}/blob/main/LICENSE`, external: true },
  { label: "Privacy", href: "/privacy", external: false },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-800/60">
      <div className="section flex flex-col gap-6 pt-10 pb-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="font-mono text-sm font-semibold tracking-tight text-ink-100">
            forktty<span className="animate-blink text-forktty">_</span>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noreferrer noopener" : undefined}
                className="text-ink-300 hover:text-forktty"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-ink-800/70 pt-5 text-xs text-ink-500 sm:flex-row sm:items-center">
          <span>
            © 2026 ForkTTY contributors · AGPL-3.0 · The app sends an anonymous
            daily ping you can disable; this site uses anonymous page-view
            analytics. Product names are trademarks of their owners.
          </span>
          <a
            href={REPO_HTML_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 hover:text-ink-200"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            Lucenx9/forktty
          </a>
        </div>
      </div>
    </footer>
  );
}

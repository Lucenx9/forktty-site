import { GitHubIcon } from "./Icons";
import { REPO_HTML_URL, RELEASES_HTML_URL } from "@/lib/github";

export function Footer() {
  return (
    <footer className="border-t border-ink-800/60">
      <div className="section py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-md">
            <div className="font-display text-base font-medium text-white">
              forktty<span className="text-forktty">_</span>
            </div>
            <p className="mt-2 text-sm text-ink-400">
              A Linux-native terminal for multi-agent coding. Rust, GTK/VTE,
              open source, local-first.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm sm:grid-cols-3">
            <FooterCol heading="Project">
              <FooterLink href={REPO_HTML_URL}>Source</FooterLink>
              <FooterLink href={RELEASES_HTML_URL}>Releases</FooterLink>
              <FooterLink href={`${REPO_HTML_URL}/issues`}>Issues</FooterLink>
            </FooterCol>
            <FooterCol heading="Docs">
              <FooterLink href={`${REPO_HTML_URL}#readme`}>README</FooterLink>
              <FooterLink href={`${REPO_HTML_URL}/blob/main/LICENSE`}>License</FooterLink>
              <FooterLink href={`${REPO_HTML_URL}/discussions`}>Discussions</FooterLink>
            </FooterCol>
            <FooterCol heading="Page">
              <FooterLink href="#download">Download</FooterLink>
              <FooterLink href="#install">Install</FooterLink>
              <FooterLink href="#faq">FAQ</FooterLink>
            </FooterCol>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-ink-800/60 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <span>
              © {new Date().getFullYear()} ForkTTY contributors. Linux-native, AGPL-3.0.
            </span>
            <span>
              The ForkTTY app has no telemetry. This site uses anonymous Vercel page-view analytics.
            </span>
          </div>
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

function FooterCol({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] uppercase tracking-[0.18em] text-ink-500">{heading}</span>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel={href.startsWith("#") ? undefined : "noreferrer noopener"}
      className="text-ink-300 hover:text-white"
    >
      {children}
    </a>
  );
}

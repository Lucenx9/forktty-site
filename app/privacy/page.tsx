import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "@/components/Icons";
import { REPO_HTML_URL } from "@/lib/github";

const APP_PRIVACY_URL = `${REPO_HTML_URL}/blob/main/PRIVACY.md`;
const ISSUES_URL = `${REPO_HTML_URL}/issues`;
const SECURITY_REPORT_URL = `${REPO_HTML_URL}/security/advisories/new`;

const SECTIONS = [
  {
    title: "What this site collects",
    body: [
      "Vercel hosts the site and may process standard request information such as IP address, user agent, timestamp, route, referrer, and coarse location derived from IP address to deliver and protect the service.",
      "Vercel Web Analytics measures page views and basic traffic patterns. Vercel documents that Web Analytics does not use cookies; visitors are counted through a daily hash derived from the incoming request, and the session lifespan is discarded after 24 hours.",
      "The download section fetches public GitHub Releases API data server-side so the page can show current release assets and release links.",
    ],
  },
  {
    title: "App telemetry endpoint",
    body: [
      "The /api/telemetry/ping endpoint accepts the ForkTTY app's anonymous daily usage ping. The accepted JSON fields are limited to schema, kind, app, version, and date.",
      "When Redis credentials are configured, the site increments an aggregate Redis counter by date and app version. It does not store an install id, username, hostname, IP address, project path, terminal contents, socket payload, or agent metadata in that counter.",
      "The Redis counter is configured with a retention limit. Hosting and platform providers may still process request metadata needed to operate the endpoint.",
    ],
  },
  {
    title: "What this site does not do",
    body: [
      "This site does not provide accounts, payments, newsletters, comments, advertising pixels, or marketing automation.",
      "This site does not use profiling cookies. It does not use cookies for Vercel Web Analytics.",
      "ForkTTY does not include model access. Agent CLIs and subscriptions are provided by their respective vendors.",
    ],
  },
  {
    title: "Your choices and rights",
    body: [
      "You can block analytics requests with browser privacy settings, content blockers, or network controls. The site remains usable without analytics.",
      "You can disable the ForkTTY app's anonymous daily ping in the app configuration before the first ping is sent; the app privacy notice explains the setting and local files in detail.",
      "For privacy questions, open a GitHub issue or use GitHub private vulnerability reporting for sensitive reports. Depending on your jurisdiction, you may have rights to access, correct, delete, restrict, or object to processing of personal data.",
    ],
  },
  {
    title: "Providers and links",
    body: [
      "The site relies on Vercel for hosting and Web Analytics, GitHub for source code and release metadata, and Redis-compatible storage for aggregate telemetry counters when configured.",
      "Links to GitHub, releases, documentation, and external provider names leave this site and are governed by those providers' own terms and privacy notices.",
      "Product names including Codex, Claude Code, Pi, Antigravity, OpenCode, GitHub, Vercel, GTK, and Ghostty are trademarks of their owners. ForkTTY is not affiliated with those providers unless stated otherwise.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "ForkTTY site privacy notice for Vercel hosting, Vercel Web Analytics, release metadata, and the app telemetry ping endpoint.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <div className="backdrop" aria-hidden>
        <span className="bloom" />
        <span className="grain" />
      </div>

      <Header />
      <main id="main">
        <section className="section py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-forktty">
              Legal
            </div>
            <h1 className="mt-5 font-display text-[2.7rem] font-semibold leading-[0.98] text-ink-100 sm:text-[4.4rem]">
              Site privacy.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ink-300 sm:text-lg">
              This notice covers forktty.dev, including the docs hub, download
              page, Vercel Web Analytics, and the ForkTTY app telemetry endpoint.
              The ForkTTY desktop app has its own privacy notice in the source
              repository.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={APP_PRIVACY_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-primary"
              >
                App privacy notice
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/docs" className="btn-secondary">
                Documentation
              </Link>
            </div>
            <p className="mt-6 font-mono text-xs text-ink-500">
              Last updated: June 19, 2026
            </p>
          </div>
        </section>

        <section className="border-t border-ink-800/60">
          <div className="section grid gap-8 py-16 sm:py-20 lg:grid-cols-2">
            {SECTIONS.map((section) => (
              <section key={section.title} className="tui-frame p-6">
                <h2 className="font-display text-2xl font-semibold leading-tight text-ink-100">
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-300">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="border-t border-ink-800/60">
          <div className="section py-12">
            <div className="max-w-3xl text-sm leading-relaxed text-ink-400">
              <h2 className="font-display text-2xl font-semibold text-ink-100">
                Contact
              </h2>
              <p className="mt-4">
                For ordinary privacy questions, use{" "}
                <a
                  href={ISSUES_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-ink-200 underline-offset-4 hover:text-forktty hover:underline"
                >
                  GitHub Issues
                </a>
                . For sensitive reports, use{" "}
                <a
                  href={SECURITY_REPORT_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-ink-200 underline-offset-4 hover:text-forktty hover:underline"
                >
                  GitHub private vulnerability reporting
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

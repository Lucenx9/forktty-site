import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight, GitHubIcon } from "@/components/Icons";
import { RELEASES_HTML_URL, REPO_HTML_URL } from "@/lib/github";

const REPO_DOCS = `${REPO_HTML_URL}/blob/main`;

const DOC_GROUPS = [
  {
    title: "Start",
    intro: "Install the current alpha, understand the runtime, and get from download to first launch.",
    links: [
      {
        label: "Install & updates",
        href: `${REPO_DOCS}/README.md#install`,
        body: "AppImage, Debian package, update checks, self-update behavior, and build-from-source requirements.",
      },
      {
        label: "Release notes",
        href: RELEASES_HTML_URL,
        body: "Published release assets, checksums, changelog summaries, and prerelease history.",
      },
    ],
  },
  {
    title: "Operate",
    intro: "Run ForkTTY day to day without losing track of agents, workspaces, and privacy boundaries.",
    links: [
      {
        label: "Agent integrations",
        href: `${REPO_DOCS}/README.md#why-forktty`,
        body: "Provider setup model for Codex, Claude Code, Antigravity, OpenCode, legacy Gemini CLI, and shell tools.",
      },
      {
        label: "Privacy",
        href: `${REPO_DOCS}/PRIVACY.md`,
        body: "Anonymous daily ping, optional GitHub update checks, and what remains local.",
      },
    ],
  },
  {
    title: "Automate",
    intro: "Use the local socket, CLI, and MCP surfaces as one automation plane.",
    links: [
      {
        label: "Socket, CLI & MCP",
        href: `${REPO_DOCS}/SPEC.md`,
        body: "Configuration fields, JSON-RPC methods, local MCP tools, limits, and security boundaries.",
      },
      {
        label: "Agent guide",
        href: `${REPO_DOCS}/AGENTS.md`,
        body: "Repository architecture, conventions, and context for coding agents working on ForkTTY.",
      },
    ],
  },
  {
    title: "Reference",
    intro: "Use these when diagnosing installs, reporting issues, or checking project direction.",
    links: [
      {
        label: "Troubleshooting",
        href: `${REPO_DOCS}/README.md#troubleshooting`,
        body: "GTK renderer notes, package expectations, and source-build prerequisites.",
      },
      {
        label: "Security policy",
        href: `${REPO_DOCS}/SECURITY.md`,
        body: "Security model, reporting path, and local trust assumptions.",
      },
      {
        label: "Changelog",
        href: `${REPO_DOCS}/CHANGELOG.md`,
        body: "Unreleased work and full historical changes from the ForkTTY repository.",
      },
      {
        label: "Roadmap",
        href: `${REPO_DOCS}/ROADMAP.md`,
        body: "Planned direction and non-goals for the alpha series.",
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Curated ForkTTY documentation index for installation, agent integrations, local socket and MCP automation, troubleshooting, privacy, security, and releases.",
};

export default function DocsPage() {
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
              Documentation
            </div>
            <h1 className="mt-5 font-display text-[2.7rem] font-semibold leading-[0.98] text-ink-100 sm:text-[4.4rem]">
              Find the right ForkTTY reference fast.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ink-300 sm:text-lg">
              The canonical docs live with the ForkTTY source. This page is the
              stable map: start with install paths, then jump into operation,
              automation, troubleshooting, release notes, or security details.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#download" className="btn-primary">
                Download first
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={REPO_HTML_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-secondary"
              >
                <GitHubIcon className="h-4 w-4" />
                Source repository
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-ink-800/60">
          <div className="section grid gap-8 py-16 sm:py-20 lg:grid-cols-2">
            {DOC_GROUPS.map((group) => (
              <section key={group.title} className="tui-frame p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-semibold leading-tight text-ink-100">
                      {group.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-400">
                      {group.intro}
                    </p>
                  </div>
                  <span className="chip shrink-0">{group.links.length} refs</span>
                </div>

                <div className="mt-6 divide-y divide-ink-800/80">
                  {group.links.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-sm font-medium text-ink-100 group-hover:text-forktty">
                          {item.label}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-ink-400">
                          {item.body}
                        </p>
                      </div>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-forktty" />
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

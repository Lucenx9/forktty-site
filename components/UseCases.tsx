import Link from "next/link";
import { ArrowRight } from "./Icons";
import { SEO_PAGES } from "@/lib/seo-pages";

export function UseCases() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-16 border-t border-ink-800/70"
      aria-labelledby="use-cases-title"
    >
      <div className="section py-20 sm:py-28">
        <div className="mb-12 grid gap-5 md:grid-cols-[1fr_1.15fr] md:items-end md:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-forktty">
              Use cases
            </p>
            <h2 id="use-cases-title" className="h-title mt-3">
              Agent workflows with dedicated context
            </h2>
          </div>
          <p className="max-w-2xl text-[15px] leading-relaxed text-ink-300">
            Start from the workspace you need: Codex, Claude Code, external MCP
            tools, git worktrees, Agent HUD, Ghostty panes, or PTY persistence.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {SEO_PAGES.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="group rounded-lg border border-ink-800 bg-ink-900/55 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-700 hover:bg-ink-850/80"
            >
              <div className="flex items-center justify-between gap-4 font-sans text-sm font-medium text-ink-100">
                <span>{page.navLabel}</span>
                <ArrowRight className="h-3.5 w-3.5 text-ink-600 transition-all group-hover:translate-x-0.5 group-hover:text-forktty" />
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-300">
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

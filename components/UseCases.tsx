import Link from "next/link";
import { SEO_PAGES } from "@/lib/seo-pages";

export function UseCases() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-16 border-t border-ink-800/60"
      aria-labelledby="use-cases-title"
    >
      <div className="section py-20 sm:py-24">
        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_1.6fr] md:gap-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-forktty">
              Use cases
            </p>
            <h2 id="use-cases-title" className="h-title mt-2">
              Agent workflows with dedicated context
            </h2>
          </div>
          <p className="max-w-2xl text-[15px] leading-relaxed text-ink-300">
            Start from the workflow you need: Codex, Claude Code, local MCP,
            git worktrees, Agent HUD, Ghostty panes, PTY persistence, or team
            orchestration.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {SEO_PAGES.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="group border border-ink-800 bg-ink-900/70 p-5 transition-colors hover:border-forktty/70 hover:bg-ink-850"
            >
              <div className="font-mono text-sm font-medium text-ink-100 group-hover:text-forktty">
                {page.navLabel}
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

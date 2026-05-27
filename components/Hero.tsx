import { ArrowRight, GitHubIcon, DownloadIcon } from "./Icons";
import { REPO_HTML_URL } from "@/lib/github";

const WORKSPACES = [
  { name: "main", href: "#top", status: "ALPHA", dot: "bg-signal-magenta", active: true },
  { name: "why", href: "#why", status: "READY", dot: "bg-signal-green", active: false },
  { name: "install", href: "#install", status: "INPUT", dot: "bg-signal-yellow", active: false },
  { name: "faq", href: "#faq", status: "IDLE", dot: "bg-ink-500", active: false },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 ascii-grid opacity-40"
      />

      <div className="section pt-10 pb-12 sm:pt-16 sm:pb-16">
        {/* The hero IS a ForkTTY window. */}
        <div className="tui-frame overflow-hidden shadow-panel">
          {/* titlebar */}
          <div className="flex items-center justify-between border-b border-ink-700 bg-ink-850 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 bg-signal-red" />
                <span className="h-2.5 w-2.5 bg-signal-yellow" />
                <span className="h-2.5 w-2.5 bg-signal-green" />
              </span>
              <span className="text-xs text-ink-300">
                forktty — <span className="text-ink-200">~/workspaces/main</span>
              </span>
            </div>
            <span className="hidden text-[11px] uppercase tracking-[0.14em] text-ink-500 sm:block">
              GTK4 · VTE · Rust
            </span>
          </div>

          {/* body: workspace rail + main pane */}
          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
            <nav
              aria-label="Workspaces"
              className="hidden flex-col gap-0.5 border-r border-ink-700 bg-ink-900/60 p-3 md:flex"
            >
              <span className="px-2 pb-2 text-[10px] uppercase tracking-[0.18em] text-ink-500">
                workspaces
              </span>
              {WORKSPACES.map((w) => (
                <a
                  key={w.name}
                  href={w.href}
                  className={`flex items-center justify-between gap-2 px-2 py-1.5 text-xs transition-colors ${
                    w.active
                      ? "bg-ink-800 text-ink-100"
                      : "text-ink-300 hover:bg-ink-850 hover:text-ink-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${w.dot}`} />
                    {w.name}
                  </span>
                  <span className="text-[9px] tracking-[0.1em] text-ink-500">
                    {w.status}
                  </span>
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-6 p-6 sm:p-10">
              <p className="text-sm text-signal-green">
                <span className="text-forktty">❯</span> forktty
              </p>

              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink-100 sm:text-5xl lg:text-6xl">
                Multi-agent terminal
                <br className="hidden sm:block" /> for Linux.
                <span className="ml-0.5 inline-block w-[0.6ch] animate-blink bg-forktty text-transparent">
                  _
                </span>
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-ink-300 sm:text-base">
                A GTK/VTE terminal written in Rust. Each workspace is a tiling
                pane layout you can dedicate to one agent — Codex, Claude Code,
                Gemini CLI, or anything else that runs in a shell. Your keys,
                your subscription, your machine.
              </p>

              {/* tiling pane preview — real bordered panes, like the product */}
              <div
                aria-hidden
                className="hidden h-28 max-w-md grid-cols-2 grid-rows-2 gap-px border border-ink-700 bg-ink-700 text-[10px] leading-relaxed text-ink-400 sm:grid"
              >
                <div className="row-span-2 bg-ink-950 p-2.5">
                  <span className="text-signal-green">$</span> claude
                  <div className="text-ink-600">  thinking...</div>
                </div>
                <div className="bg-ink-950 p-2.5">
                  <span className="text-signal-green">$</span> codex
                </div>
                <div className="bg-ink-950 p-2.5">
                  <span className="text-signal-green">$</span> gemini
                </div>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <a href="#download" className="btn-primary">
                  <DownloadIcon className="h-4 w-4" />
                  Download for Linux
                </a>
                <a
                  href={REPO_HTML_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-secondary"
                >
                  <GitHubIcon className="h-4 w-4" />
                  View source
                  <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* statusbar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink-700 bg-ink-850 px-4 py-2 text-[11px] tracking-[0.04em] text-ink-400">
            <span className="bg-forktty px-1.5 py-0.5 font-semibold text-ink-950">
              NORMAL
            </span>
            <span>linux/x86_64</span>
            <span className="text-ink-500">·</span>
            <span>AGPL-3.0</span>
            <span className="text-ink-500">·</span>
            <span className="text-signal-green">no telemetry</span>
            <span className="ml-auto hidden text-ink-500 sm:block">
              early alpha
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

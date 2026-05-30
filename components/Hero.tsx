import type { SVGProps } from "react";
import { ArrowRight, GitHubIcon, DownloadIcon } from "./Icons";
import { REPO_HTML_URL } from "@/lib/github";

// Workspaces double as the hero's section nav — same idea as the real rail.
const WORKSPACES = [
  { name: "main", path: "~", panes: 5, href: "#top", active: true },
  { name: "why", path: "~/forktty", panes: null, href: "#why", active: false },
  { name: "features", path: "~/forktty", panes: null, href: "#capabilities", active: false },
  { name: "install", path: "~/forktty", panes: null, href: "#install", active: false },
  { name: "faq", path: "~/forktty", panes: null, href: "#faq", active: false },
];

// Decorative tab strip, mirrors the real pane tabs.
const TABS = [
  { label: "simone", active: false },
  { label: "~", active: false },
  { label: "~", active: true },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 ascii-grid opacity-40"
      />

      <div className="section pt-10 pb-12 sm:pt-16 sm:pb-16">
        {/* The hero IS a ForkTTY window — mono throughout, like the real chrome. */}
        <div className="tui-frame overflow-hidden font-mono shadow-panel">
          {/* titlebar: logo · centered workspace · actions + window controls */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-ink-700 bg-ink-850 px-4 py-2">
            <div className="flex items-center gap-2 text-xs text-ink-300">
              <span className="text-forktty" aria-hidden>
                ⤙
              </span>
              <span className="text-ink-200">forktty</span>
            </div>
            <span className="text-xs text-ink-300">main</span>
            <div className="flex items-center justify-end gap-3 text-ink-500" aria-hidden>
              <SearchGlyph className="h-3.5 w-3.5" />
              <SplitGlyph className="h-3.5 w-3.5" />
              <GearGlyph className="h-3.5 w-3.5" />
              <span className="ml-1.5 flex items-center gap-2.5">
                <span className="h-px w-2.5 bg-ink-500" />
                <span className="h-2.5 w-2.5 border border-ink-500" />
                <CloseGlyph className="h-2.5 w-2.5" />
              </span>
            </div>
          </div>

          {/* body: workspace rail + main pane */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
            <nav
              aria-label="Workspaces"
              className="hidden flex-col border-r border-ink-700 bg-ink-900/60 py-2 md:flex"
            >
              <div className="flex items-center justify-between px-4 pb-2 pt-1">
                <span className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  workspaces
                </span>
                <span className="text-ink-600" aria-hidden>
                  +
                </span>
              </div>
              {WORKSPACES.map((w) => (
                <a
                  key={w.name}
                  href={w.href}
                  className={`flex items-center justify-between gap-2 border-l-2 px-4 py-2 transition-colors ${
                    w.active
                      ? "border-forktty bg-ink-800"
                      : "border-transparent hover:bg-ink-850"
                  }`}
                >
                  <span className="flex flex-col gap-0.5">
                    <span
                      className={`text-xs ${
                        w.active ? "font-semibold text-ink-100" : "text-ink-200"
                      }`}
                    >
                      {w.name}
                    </span>
                    <span className="text-[10px] text-ink-500">{w.path}</span>
                  </span>
                  {w.panes != null && (
                    <span className="flex items-center gap-1 text-[10px] text-ink-400">
                      <span aria-hidden>▦</span>
                      {w.panes}
                    </span>
                  )}
                </a>
              ))}
            </nav>

            <div className="flex flex-col">
              {/* tab strip */}
              <div
                aria-hidden
                className="flex items-stretch border-b border-ink-700 bg-ink-900/40 text-xs"
              >
                {TABS.map((t, i) => (
                  <span
                    key={i}
                    className={`border-t-2 px-4 py-2 ${
                      t.active
                        ? "border-forktty bg-ink-850 text-ink-200"
                        : "border-transparent text-ink-500"
                    }`}
                  >
                    {t.label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-6 p-6 sm:p-10">
                {/* prompt + agent statusline, like a live pane */}
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span>
                    <span className="text-signal-magenta">~</span>{" "}
                    <span className="text-signal-green">❯</span>{" "}
                    <span className="text-ink-200">forktty</span>
                  </span>
                  <span className="hidden font-mono text-[11px] tracking-[0.06em] text-ink-500 sm:inline">
                    ◍ <span className="text-ink-300">claude</span> ·{" "}
                    <span className="text-signal-green">ready</span>
                  </span>
                </div>

                <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink-100 sm:text-5xl lg:text-6xl">
                  Multi-agent terminal
                  <br className="hidden sm:block" /> for Linux.
                  <span className="ml-0.5 inline-block w-[0.6ch] animate-blink bg-forktty text-transparent">
                    _
                  </span>
                </h1>

                <p className="max-w-2xl font-sans text-sm leading-relaxed text-ink-300 sm:text-base">
                  A GTK/VTE terminal written in Rust. Each workspace is a tiling
                  layout you can dedicate to one agent — Codex, Claude Code,
                  Gemini CLI, or anything that runs in a shell. Scriptable over a
                  local socket, backed by git worktrees. Your keys, your
                  subscription, your machine.
                </p>

                {/* tiling pane preview — bordered panes, like the product */}
                <div
                  aria-hidden
                  className="hidden h-28 max-w-md grid-cols-2 grid-rows-2 gap-px border border-ink-700 bg-ink-700 text-[10px] leading-relaxed text-ink-400 sm:grid"
                >
                  <div className="row-span-2 bg-ink-950 p-2.5">
                    <span className="text-signal-magenta">~</span>{" "}
                    <span className="text-signal-green">❯</span> claude
                    <div className="text-ink-600">  thinking…</div>
                  </div>
                  <div className="bg-ink-950 p-2.5">
                    <span className="text-signal-magenta">~</span>{" "}
                    <span className="text-signal-green">❯</span> codex
                  </div>
                  <div className="bg-ink-950 p-2.5">
                    <span className="text-signal-magenta">~</span>{" "}
                    <span className="text-signal-green">❯</span> gemini
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
          </div>

          {/* statusbar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink-700 bg-ink-850 px-4 py-2 text-[11px] tracking-[0.04em] text-ink-400">
            <span className="font-semibold text-ink-200">main</span>
            <span className="text-ink-500">·</span>
            <span className="text-signal-magenta">~</span>
            <span className="text-ink-500">·</span>
            <span>Pane 1/3</span>
            <span className="text-ink-500">·</span>
            <span>AGPL-3.0</span>
            <span className="text-ink-500">·</span>
            <span className="text-signal-green">no telemetry</span>
            <span className="ml-auto hidden text-ink-500 sm:block">Ctrl+Shift+P</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SplitGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M13 4v16" />
    </svg>
  );
}

function GearGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </svg>
  );
}

function CloseGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

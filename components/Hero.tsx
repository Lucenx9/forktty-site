import { ArrowRight, GitHubIcon, DownloadIcon } from "./Icons";
import { REPO_HTML_URL } from "@/lib/github";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 ascii-grid opacity-40"
      />

      <div className="section pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="flex max-w-3xl flex-col gap-6">
          {/* prompt + live agent status, like the top of a real pane */}
          <div className="flex items-baseline justify-between gap-4 font-mono text-sm">
            <span>
              <span className="text-signal-magenta">~</span>{" "}
              <span className="text-signal-green">❯</span>{" "}
              <span className="text-ink-200">forktty</span>
            </span>
            <span className="hidden text-[11px] tracking-[0.06em] text-ink-500 sm:inline">
              ◍ <span className="text-ink-300">claude</span> ·{" "}
              <span className="text-signal-green">ready</span>
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.04] tracking-tight text-ink-100 sm:text-6xl lg:text-7xl">
            Multi-agent terminal
            <br className="hidden sm:block" /> for Linux.
            <span className="ml-1 inline-block w-[0.55ch] animate-blink bg-forktty align-baseline text-transparent">
              _
            </span>
          </h1>

          <p className="max-w-2xl font-sans text-base leading-relaxed text-ink-300 sm:text-lg">
            A GTK/Ghostty terminal written in Rust. Run Codex, Claude Code, Gemini
            CLI, or any shell agent in tiling panes — scriptable over a local
            socket, backed by git worktrees. Your keys, your subscription, your
            machine.
          </p>

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

          {/* minimal statusline — a nod to the app, not a second window */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink-800 pt-4 font-mono text-[11px] tracking-[0.04em] text-ink-500">
            <span className="text-ink-300">linux/x86_64</span>
            <span>·</span>
            <span>GTK4 / Ghostty</span>
            <span>·</span>
            <span>AGPL-3.0</span>
            <span>·</span>
            <span className="text-signal-green">no telemetry</span>
          </div>
        </div>
      </div>
    </section>
  );
}

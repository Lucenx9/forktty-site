import { ArrowRight, GitHubIcon, DownloadIcon } from "./Icons";
import { REPO_HTML_URL } from "@/lib/github";

export function Hero() {
  return (
    <section
      id="top"
      data-pane
      data-index="01"
      data-label="~"
      className="relative scroll-mt-16 overflow-hidden"
    >
      <div className="section grid items-center gap-12 pt-14 pb-20 sm:pt-20 lg:grid-cols-[1.02fr_1fr] lg:gap-10 lg:pb-28">
        {/* ── Copy column ─────────────────────────────────────────────── */}
        <div className="flex max-w-2xl flex-col gap-6">
          <div
            className="reveal flex items-center gap-3 font-mono text-xs text-ink-400"
            style={{ animationDelay: "40ms" }}
          >
            <span className="chip border-forktty/30 text-forktty">v0.2 alpha</span>
            <span className="hidden sm:inline">
              <span className="text-signal-magenta">~</span>{" "}
              <span className="text-signal-green">❯</span>{" "}
              <span className="text-ink-200">forktty</span>
            </span>
          </div>

          <h1
            className="reveal font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink-100 sm:text-6xl lg:text-[4.4rem]"
            style={{ animationDelay: "110ms" }}
          >
            Multi-agent
            <br />
            terminal for
            <br />
            <span className="text-forktty">Linux</span>
            <span className="ml-2 inline-block h-[0.78em] w-[0.5ch] translate-y-[0.06em] animate-blink bg-forktty" />
          </h1>

          <p
            className="reveal max-w-xl font-sans text-base leading-relaxed text-ink-300 sm:text-lg"
            style={{ animationDelay: "210ms" }}
          >
            A GTK/Ghostty terminal written in Rust. Run Codex, Claude Code,
            Gemini CLI, or any shell agent in tiling panes — scriptable over a
            local socket, backed by git worktrees. Your keys, your
            subscription, your machine.
          </p>

          <div
            className="reveal mt-1 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "300ms" }}
          >
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

          <div
            className="reveal mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink-800 pt-4 font-mono text-[11px] tracking-[0.04em] text-ink-500"
            style={{ animationDelay: "400ms" }}
          >
            <span className="text-ink-300">linux/x86_64</span>
            <span aria-hidden>·</span>
            <span>GTK4 / Ghostty</span>
            <span aria-hidden>·</span>
            <span>AGPL-3.0</span>
            <span aria-hidden>·</span>
            <span className="text-signal-green">no telemetry</span>
          </div>
        </div>

        {/* ── Live faux-ForkTTY window ────────────────────────────────── */}
        <div
          className="reveal lg:-mr-6 xl:-mr-12"
          style={{ animationDelay: "240ms" }}
        >
          <FauxWindow />
        </div>
      </div>
    </section>
  );
}

function FauxWindow() {
  return (
    <div className="overflow-hidden rounded-none border border-ink-700 bg-ink-900/85 shadow-panel backdrop-blur-sm">
      {/* libadwaita-style header bar — a native window, not a web shell */}
      <div className="flex items-center gap-3 border-b border-ink-800 bg-ink-850/80 px-3 py-2 font-mono text-[11px] text-ink-400">
        <span className="text-ink-500" aria-hidden>
          ≡
        </span>
        <span className="text-ink-200">main</span>
        <span className="text-ink-600">· forktty</span>
        <span className="ml-auto flex items-center gap-3 text-ink-600" aria-hidden>
          <span>—</span>
          <span>☐</span>
          <span className="text-ink-500">✕</span>
        </span>
      </div>

      {/* tiling split: focused shell pane + agent pane */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* shell pane — focused, orange outline like the real app */}
        <div className="relative border-b border-ink-800 bg-ink-950/60 p-3.5 font-mono text-[12px] leading-relaxed sm:border-b-0 sm:border-r">
          <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-forktty/55" />
          <PaneTab n="1" name="zsh" focused />
          <div className="mt-2 space-y-1.5">
            <Cmd>forktty</Cmd>
            <Out>
              <span className="text-ink-500">[forktty]</span> workspace{" "}
              <span className="text-signal-aqua">&quot;main&quot;</span> ready ·
              socket up
            </Out>
            <Cmd>forktty split-surface --axis v</Cmd>
            <Cmd caret>claude</Cmd>
          </div>
        </div>

        {/* agent pane — a coding agent reporting status */}
        <div className="relative bg-ink-925/60 p-3.5 font-mono text-[12px] leading-relaxed">
          <PaneTab n="2" name="claude" />
          <div className="mt-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal-green animate-pulse-soft" />
              <span className="text-forktty">claude</span>
              <span className="text-ink-400">running</span>
              <span className="ml-auto text-[10px] uppercase tracking-[0.14em] text-ink-600">
                12s
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden bg-ink-800">
              <div className="shimmer-bar h-full w-full" />
            </div>
            <div className="space-y-1 text-ink-400">
              <div>
                <span className="text-signal-green">↳</span> editing{" "}
                <span className="text-ink-200">src/agent.rs</span>
              </div>
              <div>
                <span className="text-signal-green">↳</span> 2 files{" "}
                <span className="text-signal-aqua">+48</span>{" "}
                <span className="text-signal-red">−11</span>
              </div>
              <div className="text-signal-yellow">◍ awaiting review</div>
            </div>
          </div>
        </div>
      </div>

      {/* in-window statusline — the same furniture echoed page-wide */}
      <div className="flex items-center gap-2 border-t border-ink-800 bg-ink-850/80 px-2 py-1 font-mono text-[10px] tracking-[0.04em] text-ink-500">
        <span className="bg-forktty px-1.5 font-semibold text-ink-950">
          NORMAL
        </span>
        <span className="text-signal-green">main</span>
        <span className="text-ink-700" aria-hidden>
          │
        </span>
        <span>2 panes</span>
        <span className="text-ink-700" aria-hidden>
          │
        </span>
        <span className="hidden sm:inline">⎇ feat/agents</span>
        <span className="ml-auto flex items-center gap-1.5 text-signal-green">
          <span className="h-1 w-1 rounded-full bg-signal-green" />
          ready
        </span>
      </div>
    </div>
  );
}

function PaneTab({
  n,
  name,
  focused,
}: {
  n: string;
  name: string;
  focused?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]">
      <span className={focused ? "text-forktty" : "text-ink-600"}>{n}:</span>
      <span className={focused ? "text-ink-200" : "text-ink-500"}>{name}</span>
    </div>
  );
}

function Cmd({
  children,
  caret,
}: {
  children: React.ReactNode;
  caret?: boolean;
}) {
  return (
    <div className="text-ink-200">
      <span className="text-signal-magenta">~</span>{" "}
      <span className="text-signal-green">❯</span> {children}
      {caret && (
        <span className="ml-0.5 inline-block h-[1.05em] w-[0.5ch] translate-y-[0.16em] animate-blink bg-forktty" />
      )}
    </div>
  );
}

function Out({ children }: { children: React.ReactNode }) {
  return <div className="pl-[1.4ch] text-ink-400">{children}</div>;
}

import { PaneBar } from "./PaneBar";

const ITEMS = [
  {
    q: "What is ForkTTY, in one sentence?",
    a: "A Linux-native GTK/Ghostty terminal, written in Rust, for running multiple coding agents side by side — with a programmable local socket API, first-class git worktrees, and prompt-aware notifications.",
  },
  {
    q: "Does ForkTTY ship with an AI model?",
    a: "No. ForkTTY is bring-your-own-CLI: you install the agent of your choice, authenticate with your own keys or subscription, and ForkTTY just hosts the PTYs. Nothing is proxied.",
  },
  {
    q: "Why GTK/Ghostty instead of a web stack?",
    a: "Ghostty is a fast, modern terminal engine. ForkTTY embeds it (libghostty-vt) for faithful xterm emulation and true-colour rendering, so we can focus on the orchestration layer instead of reimplementing a terminal in JavaScript.",
  },
  {
    q: "Will there be a macOS or Windows build?",
    a: "Not in alpha. ForkTTY is unapologetically Linux-first; portability isn't a near-term goal.",
  },
  {
    q: "Is anything sent to a server?",
    a: "No. ForkTTY itself has no telemetry, no auto-update server, no analytics. Agent CLIs talk only to whatever endpoint you configure them to.",
  },
  {
    q: "Can I script or automate it?",
    a: "Yes — that's a core feature. The same forktty binary speaks a JSON-RPC API over a user-local Unix socket: forktty list, focus, split-surface, send-text, worktree-status, notify, events, and more. Diagnostics like forktty doctor work even when the GUI isn't running.",
  },
  {
    q: "What happened to the browser pane?",
    a: "It is still in the source tree as an experimental WebKitGTK6 feature, but alpha downloads are GTK/Ghostty-only for now. Build with --features browser only if you intentionally want to test that path.",
  },
  {
    q: "Does it really do git worktrees?",
    a: "Yes. Workspaces can be backed by isolated git worktrees that ForkTTY creates, attaches, merges, and removes via native git2 operations — with dirty-state protection and optional .forktty/setup and teardown hooks run inside the verified worktree.",
  },
  {
    q: "How do agents report status into the sidebar?",
    a: "Through installable hooks. Run forktty hooks setup to wire up Codex, Claude Code, Gemini CLI, or OpenCode; they then push status, progress, logs, and prompt notifications back through the socket, so a blocked or waiting agent shows up in the workspace rail.",
  },
  {
    q: "Can I extend or fork it?",
    a: "Yes. ForkTTY is open source under AGPL-3.0. Build on the socket API, wire your own orchestrator on top, or fork the Rust source outright — that's exactly the point.",
  },
  {
    q: "AppImage or .deb?",
    a: "The AppImage is the primary alpha download and works on most modern distros that ship a recent glibc — it bundles the GTK4, libadwaita, and Ghostty libraries it needs. Prefer the .deb on Debian/Ubuntu if you want apt package-manager integration. Verify either against SHA256SUMS first.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      data-pane
      data-index="07"
      data-label="faq"
      className="pane scroll-mt-16"
    >
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col items-start gap-4">
          <PaneBar index="07" label="faq" />
          <h2 className="h-title">Common questions</h2>
        </div>

        <div className="mt-12 divide-y divide-ink-800 overflow-hidden rounded-none border border-ink-800">
          {ITEMS.map((item, i) => (
            <details key={i} className="group bg-ink-900">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-base text-ink-100 transition-colors hover:bg-ink-850">
                <span className="font-mono text-[15px] font-medium tracking-tight">{item.q}</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4 shrink-0 text-ink-400 transition-transform group-open:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-sm leading-relaxed text-ink-300">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

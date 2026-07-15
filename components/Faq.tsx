const ITEMS = [
  {
    q: "Does ForkTTY ship with an AI model?",
    a: "No. ForkTTY is bring-your-own-CLI: you install the agent of your choice, authenticate with your own keys or subscription, and ForkTTY just hosts the PTYs. Nothing is proxied.",
  },
  {
    q: "Which agents have first-class integration?",
    a: "Every agent CLI works as a normal terminal process. Optional manual hooks for Codex, Claude Code, Antigravity, and OpenCode add lifecycle metadata for the Agent HUD and supported resume flows. Pi, Grok Build, shells, editors, and custom tools need no ForkTTY-specific integration.",
  },
  {
    q: "Can I script or automate it?",
    a: "Yes. The forktty binary speaks a bounded JSON-RPC-like API over an owner-only Unix socket for workspaces, panes, focus, terminal text, notifications, worktrees, project actions, remotes, and thin agent lifecycle controls. ForkTTY does not ship an MCP bridge; external MCP tools still run normally inside panes.",
  },
  {
    q: "Does it really do git worktrees?",
    a: "Yes. Workspaces can be backed by isolated git worktrees that ForkTTY creates, attaches, merges, and removes via native git2 operations — with dirty-state protection and optional .forktty/setup and teardown hooks.",
  },
  {
    q: "Are browser panes included in the downloads?",
    a: "No. The alpha AppImage and .deb are GTK/Ghostty terminal builds. WebKitGTK browser panes, browser profiles, history/bookmarks, and import flows remain source-only behind the browser feature for intentional testing.",
  },
  {
    q: "Will there be a macOS or Windows build?",
    a: "Not in alpha. ForkTTY is unapologetically Linux-first; portability isn't a near-term goal.",
  },
  {
    q: "Is anything sent to a server?",
    a: "Only an anonymous daily usage ping and an optional once-a-day GitHub update check, both on by default and one toggle to disable. The ping carries just a schema tag, app name, version, and date — no crash reports, analytics, identifiers, terminal contents, or project data. A first-launch dialog shows the toggle before anything is sent. Agent CLIs talk only to whatever endpoint you configure them to.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-t border-ink-800/70">
      <div className="section py-20 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-forktty">
          FAQ
        </p>
        <h2 className="h-title mt-3">Common questions</h2>

        <div className="mt-10 divide-y divide-ink-800 overflow-hidden rounded-lg border border-ink-800">
          {ITEMS.map((item) => (
            <details key={item.q} className="group bg-ink-900/65 open:bg-ink-850/70">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-base text-ink-100 transition-colors hover:bg-white/[0.025]">
                <span className="font-sans text-[15px] font-medium">{item.q}</span>
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
              <div className="max-w-4xl px-6 pb-6 text-sm leading-relaxed text-ink-300">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

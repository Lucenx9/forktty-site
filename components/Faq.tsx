const ITEMS = [
  {
    q: "Does ForkTTY ship with an AI model?",
    a: "No. ForkTTY is bring-your-own-CLI: you install the agent of your choice, authenticate with your own keys or subscription, and ForkTTY just hosts the PTYs. Nothing is proxied.",
  },
  {
    q: "Can I script or automate it?",
    a: "Yes — that's a core feature. The same forktty binary speaks a JSON-RPC API over a user-local Unix socket: forktty list, focus, split-surface, send-text, worktree-status, notify, events, and more. Diagnostics like forktty doctor work even when the GUI isn't running.",
  },
  {
    q: "Does it really do git worktrees?",
    a: "Yes. Workspaces can be backed by isolated git worktrees that ForkTTY creates, attaches, merges, and removes via native git2 operations — with dirty-state protection and optional .forktty/setup and teardown hooks.",
  },
  {
    q: "Will there be a macOS or Windows build?",
    a: "Not in alpha. ForkTTY is unapologetically Linux-first; portability isn't a near-term goal.",
  },
  {
    q: "Is anything sent to a server?",
    a: "No. ForkTTY itself has no telemetry, no auto-update server, no analytics. Agent CLIs talk only to whatever endpoint you configure them to.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <h2 className="h-title">Common questions</h2>

        <div className="mt-10 divide-y divide-ink-800 overflow-hidden rounded-none border border-ink-800">
          {ITEMS.map((item) => (
            <details key={item.q} className="group bg-ink-900">
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

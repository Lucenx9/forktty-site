const FEATURES = [
  {
    n: "01",
    title: "Agent HUD, not scrollback archaeology.",
    body: "Hooks for Codex, Claude Code, Antigravity, and OpenCode persist session ids, cwd, lifecycle, and last activity so the GTK HUD can focus or resume an agent in a new tab.",
    cmd: "forktty agents",
  },
  {
    n: "02",
    title: "Worktrees are first-class workspaces.",
    body: "Each task gets an isolated git worktree workspace: create, attach, merge, remove — with dirty-state protection and setup/teardown hooks.",
    cmd: "forktty worktree-status",
  },
  {
    n: "03",
    title: "Socket and MCP automation share one surface.",
    body: "The user-local JSON-RPC socket backs the CLI and MCP server: inspect panes, read terminal text, capture tails, split or focus panes, manage worktrees, publish status, and drive team, workflow, feed, project-action, and remote-inventory control planes.",
    cmd: "forktty top",
  },
  {
    n: "04",
    title: "Ghostty terminals with native Linux polish.",
    body: "GTK4/libadwaita in Rust on Ghostty's terminal engine: split panes, tabs, scrollback search, OSC links, Ctrl-click open, middle-click PRIMARY paste, visual bell, and desktop notifications.",
    cmd: null,
  },
  {
    n: "05",
    title: "Local-first by design.",
    body: "No crash reports, no event tracking, no terminal or project data leaving the machine. An anonymous daily usage ping and once-a-day GitHub update check are on by default but one toggle away. Owner-only Unix socket, bounded config/session files, argv-based command execution. Bring your own agent CLI and keys.",
    cmd: null,
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col divide-y divide-ink-800/80">
          {FEATURES.map((f) => (
            <div
              key={f.n}
              className="grid gap-4 py-10 first:pt-0 last:pb-0 md:grid-cols-[1fr_1.6fr] md:gap-12"
            >
              <h2 className="font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-ink-100 sm:text-2xl">
                <span className="mr-3 font-mono text-sm font-normal text-forktty">
                  {f.n}
                </span>
                {f.title}
              </h2>
              <div className="flex flex-col gap-4">
                <p className="text-[15px] leading-relaxed text-ink-300">
                  {f.body}
                </p>
                {f.cmd && (
                  <p className="font-mono text-[13px] text-ink-400">
                    <span className="text-signal-green">❯</span>{" "}
                    <span className="text-ink-200">{f.cmd}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

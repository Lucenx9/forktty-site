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
    body: "The user-local JSON-RPC socket backs the CLI and MCP server, so tools can inspect panes, read context snapshots and terminal tails, split or focus panes, manage worktrees, resume agents, and publish team status.",
    cmd: "forktty top",
  },
  {
    n: "04",
    title: "Ghostty terminals with native Linux polish.",
    body: "GTK4/libadwaita in Rust around Ghostty's embedded terminal widget: split panes, tabs, retained scrollback, native selection and clipboard behavior, OSC links, visual bell, and desktop notifications.",
    cmd: null,
  },
  {
    n: "05",
    title: "Local-first by design.",
    body: "Terminal contents, project data, and session files stay local. The default telemetry is limited to an anonymous daily usage ping and a once-a-day GitHub update check, both shown at first launch and controlled by a toggle. The Unix socket is owner-only, command execution is argv-based, and agent CLIs keep their own credentials.",
    cmd: null,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-16 border-t border-ink-800/60"
      aria-labelledby="features-title"
    >
      <div className="section py-20 sm:py-24">
        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_1.6fr] md:gap-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-forktty">
              Capabilities
            </p>
            <h2 id="features-title" className="h-title mt-2">
              Built for agent workspaces
            </h2>
          </div>
          <p className="max-w-2xl text-[15px] leading-relaxed text-ink-300">
            ForkTTY keeps terminal panes, agent sessions, and git worktrees
            visible without moving project data off your machine.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-ink-800/80">
          {FEATURES.map((f) => (
            <div
              key={f.n}
              className="grid gap-4 py-10 first:pt-0 last:pb-0 md:grid-cols-[1fr_1.6fr] md:gap-12"
            >
              <h3 className="font-display text-xl font-semibold leading-snug text-ink-100 sm:text-2xl">
                <span className="mr-3 font-mono text-sm font-normal text-forktty">
                  {f.n}
                </span>
                {f.title}
              </h3>
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

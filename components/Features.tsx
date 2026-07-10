const FEATURES = [
  {
    n: "01",
    title: "Router context stays beside the terminal.",
    body: "The GTK workbench keeps the task router, workflow loop state, approvals, workers, reports, agents, and notifications visible next to the panes while planning remains read-only until apply is explicit.",
    cmd: "forktty task-plan",
  },
  {
    n: "02",
    title: "Agent HUD, not scrollback archaeology.",
    body: "Hooks for Codex, Claude Code, Antigravity, and OpenCode persist session ids, cwd, lifecycle, and last activity so the GTK HUD can focus, resume, and show compact loop state for an agent.",
    cmd: "forktty agents",
  },
  {
    n: "03",
    title: "Worktrees are first-class workspaces.",
    body: "Each task gets an isolated git worktree workspace: create, attach, merge, remove, with dirty-state protection and setup/teardown hooks.",
    cmd: "forktty worktree-status",
  },
  {
    n: "04",
    title: "Socket and MCP automation share one surface.",
    body: "The user-local JSON-RPC socket backs the CLI and MCP server, so tools can plan task strategy with explainable router profiles, workflow-inferred last-known-good stickiness, and harness routing signals, stage or submit approved team runs, inspect panes, read context snapshots and terminal tails, manage worktrees, resume agents, and publish team status.",
    cmd: "forktty task-plan",
  },
  {
    n: "05",
    title: "Ghostty terminals with native Linux polish.",
    body: "GTK4/libadwaita in Rust around Ghostty's embedded terminal widget: split panes, tabs, retained scrollback, native selection and clipboard behavior, OSC links, visual bell, and desktop notifications.",
    cmd: null,
  },
  {
    n: "06",
    title: "Local-first by design.",
    body: "Terminal contents, project data, and session files stay local. The default telemetry is limited to an anonymous daily usage ping and a once-a-day GitHub update check, both shown at first launch and controlled by a toggle. The Unix socket is owner-only, command execution is argv-based, and agent CLIs keep their own credentials.",
    cmd: null,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-16 border-t border-ink-800/70"
      aria-labelledby="features-title"
    >
      <div className="section py-20 sm:py-28">
        <div className="mb-12 grid gap-5 md:grid-cols-[1fr_1.15fr] md:items-end md:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-forktty">
              Capabilities
            </p>
            <h2 id="features-title" className="h-title mt-3">
              Built for agent workspaces
            </h2>
          </div>
          <p className="max-w-2xl text-[15px] leading-relaxed text-ink-300">
            ForkTTY keeps terminal panes, agent sessions, and git worktrees
            visible without moving project data off your machine.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {FEATURES.map((f) => (
            <article
              key={f.n}
              className="group flex min-h-72 flex-col justify-between rounded-lg border border-ink-800 bg-ink-900/55 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-700 hover:bg-ink-850/80 sm:p-7"
            >
              <div>
                <span className="mb-6 block h-1.5 w-1.5 rounded-full bg-forktty shadow-[0_0_16px_rgba(242,140,82,0.55)]" aria-hidden />
                <h3 className="font-display text-xl font-medium leading-snug tracking-[-0.025em] text-ink-100 sm:text-2xl">
                  {f.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-300">
                  {f.body}
                </p>
              </div>
              <div className="mt-8">
                {f.cmd && (
                  <p className="inline-flex rounded-md border border-ink-800 bg-ink-950/80 px-3 py-2 font-mono text-xs text-ink-400">
                    <span className="text-signal-green">❯</span>{" "}
                    <span className="text-ink-200">{f.cmd}</span>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

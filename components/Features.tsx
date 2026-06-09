const FEATURES = [
  {
    n: "01",
    title: "Agent status, out of the scrollback.",
    body: "Install hooks for Codex, Claude Code, Gemini CLI, or OpenCode and they report status, progress, and prompt-aware notifications through the socket — a blocked agent surfaces in the sidebar, not buried in a pane.",
    cmd: "forktty hooks setup",
  },
  {
    n: "02",
    title: "One task, one worktree.",
    body: "Give each task an isolated git worktree workspace: create, attach, merge, and remove via native git2 — with dirty-state protection and optional setup and teardown hooks.",
    cmd: "forktty worktree-status",
  },
  {
    n: "03",
    title: "A terminal you can drive from a script.",
    body: "The same orchestration the UI uses is a JSON-RPC API on a user-local Unix socket: open workspaces, split panes, send keystrokes, post notifications. The GTK app is just one client.",
    cmd: 'forktty send-text "cargo test\\n"',
  },
  {
    n: "04",
    title: "Native Linux, not a port.",
    body: "A GTK4/libadwaita app in Rust on Ghostty's terminal engine — fast, faithful xterm emulation, no Electron. Bring your own agent CLI and keys; nothing is proxied, nothing is phoned home.",
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

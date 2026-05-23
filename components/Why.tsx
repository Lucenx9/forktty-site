export function Why() {
  return (
    <section id="why" className="border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4">
            <span className="h-eyebrow">WHY</span>
            <h2 className="h-title">Native Linux, not a port.</h2>
            <p className="text-ink-300">
              ForkTTY is a GTK4 application that uses VTE — the same terminal
              widget behind GNOME Terminal and Tilix — so xterm emulation,
              true colour, ligatures, and scrollback work the way every other
              VTE terminal does. No Electron, no web shell, no embedded
              browser.
            </p>
            <p className="text-ink-300">
              The orchestration sits in Rust on top of that: workspaces hold
              tiling pane layouts, each pane is a real PTY, and the agent CLI
              talking to it has no idea it&rsquo;s being multiplexed.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <Point title="Bring your own CLI">
              ForkTTY ships no model, no proxy, no API key. Install Codex,
              Claude Code, Gemini CLI, aider, or a custom script and run it
              in a pane. Your credentials, your rate limits, your bill.
            </Point>
            <Point title="Workspaces, not tabs">
              A workspace is a saved pane layout you can dedicate to one task
              or one agent. Switch with a single shortcut; the panes stay
              attached to their PTYs in the background.
            </Point>
            <Point title="Local-first, no telemetry">
              Sessions, history, and keys live on your machine. ForkTTY makes
              zero outbound connections for analytics, updates, or crash
              reporting. It&rsquo;s open source under AGPL-3.0 — fork it, audit
              it, patch it.
            </Point>
          </div>
        </div>
      </div>
    </section>
  );
}

function Point({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-ink-800 pl-5">
      <h3 className="font-display text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-300">{children}</p>
    </div>
  );
}

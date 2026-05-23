const WORKFLOWS = [
  {
    name: "Plan / build / verify",
    summary:
      "Three panes, three roles. One agent plans, one writes the patch, one reviews the diff.",
    panes: [
      { label: "codex", cmd: "codex --plan refactor/auth" },
      { label: "claude", cmd: "claude --apply" },
      { label: "gemini", cmd: "gemini review --strict" },
    ],
  },
  {
    name: "Race the same task",
    summary:
      "Run the same prompt across multiple models in parallel. Diff their outputs side by side.",
    panes: [
      { label: "codex", cmd: "codex solve 'fix N+1 in feed.rs'" },
      { label: "claude", cmd: "claude solve 'fix N+1 in feed.rs'" },
      { label: "gemini", cmd: "gemini solve 'fix N+1 in feed.rs'" },
    ],
  },
  {
    name: "Long-running swarm",
    summary:
      "Detach panes, let agents grind. Reattach later — scrollback, exit codes, and PTY state are all intact.",
    panes: [
      { label: "worker-1", cmd: "agent run migrations/*" },
      { label: "worker-2", cmd: "agent run lint/* --autofix" },
      { label: "supervisor", cmd: "watch -n 5 status" },
    ],
  },
];

export function Workflows() {
  return (
    <section id="workflows" className="border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col items-start gap-4">
          <span className="h-eyebrow">03 · Workflows</span>
          <h2 className="h-title max-w-2xl">Multiplex agents the way you multiplex shells.</h2>
          <p className="max-w-2xl text-ink-300">
            ForkTTY doesn&rsquo;t lock you into a single agent or a single
            pattern. Pick a layout, route prompts where you want them, and let
            the panes do the work.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {WORKFLOWS.map((w, i) => (
            <WorkflowRow key={w.name} index={i + 1} workflow={w} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowRow({
  index,
  workflow,
}: {
  index: number;
  workflow: (typeof WORKFLOWS)[number];
}) {
  return (
    <div className="terminal-frame overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[1fr_2fr]">
        <div className="border-b border-ink-800/80 p-6 md:border-b-0 md:border-r">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
            pattern {String(index).padStart(2, "0")}
          </div>
          <h3 className="mt-2 font-display text-xl text-white">{workflow.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-300">{workflow.summary}</p>
        </div>
        <div className="grid grid-cols-1 divide-y divide-ink-800/80 md:grid-cols-3 md:divide-x md:divide-y-0">
          {workflow.panes.map((p) => (
            <div key={p.label} className="flex flex-col gap-2 p-5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-300">
                  {p.label}
                </span>
              </div>
              <pre className="overflow-x-auto rounded-md border border-ink-800 bg-ink-950/60 px-3 py-2 font-mono text-[12.5px] text-ink-100">
                <span className="text-ember-soft">$</span> {p.cmd}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

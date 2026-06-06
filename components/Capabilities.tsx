import type { SVGProps } from "react";
import { PlugIcon, BranchIcon, BellIcon, LayersIcon } from "./Icons";
import { PaneBar } from "./PaneBar";

type Capability = {
  icon: (props: SVGProps<SVGSVGElement>) => React.ReactNode;
  title: string;
  body: string;
  // a representative command, rendered like a terminal line
  cmd: string;
};

const CAPABILITIES: Capability[] = [
  {
    icon: PlugIcon,
    title: "Programmable socket API",
    body: "Every workspace, pane, and notification is scriptable over a user-local Unix socket — JSON-RPC, owner-only permissions. The same forktty binary drives it, and diagnostics work even when the GUI isn't running.",
    cmd: 'forktty send-text "cargo test\\n"',
  },
  {
    icon: BranchIcon,
    title: "Git worktree workspaces",
    body: "Give a task its own git worktree, then attach, merge, or remove it. Removal is blocked while the tree is dirty, and optional .forktty/setup and teardown hooks run inside the verified worktree.",
    cmd: "forktty worktree-status",
  },
  {
    icon: BellIcon,
    title: "Agent hooks & notifications",
    body: "Install hook templates for Codex, Claude Code, Gemini CLI, and OpenCode. They report status, progress, and prompt-aware notifications through the socket, so a blocked agent surfaces in the sidebar — not buried in scrollback.",
    cmd: "forktty hooks setup",
  },
  {
    icon: LayersIcon,
    title: "Panes, tabs, and restore",
    body: "Split the focused pane, open tabs inside a pane, switch surfaces from scripts, and restore workspace order, active pane state, tabs, and split ratios across restarts.",
    cmd: "forktty split-surface --axis vertical",
  },
];

// Smaller secondary capabilities, shown as a tight terminal-style strip.
const ALSO = [
  "command palette",
  "quake / dropdown mode",
  "SSH remote workspaces",
  "session restore",
  "tiling split panes",
  "terminal themes",
];

export function Capabilities() {
  return (
    <section
      id="capabilities"
      data-pane
      data-index="05"
      data-label="capabilities"
      className="pane scroll-mt-16"
    >
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col items-start gap-4">
          <PaneBar index="05" label="capabilities" />
          <h2 className="h-title max-w-2xl">
            A terminal you can drive from a script.
          </h2>
          <p className="max-w-2xl text-ink-300">
            The same orchestration the UI uses is exposed over a user-local Unix
            socket. Scripts and agent hooks can open workspaces, split panes,
            send keystrokes, manage worktrees, and post notifications — the GTK
            app is just one client.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {CAPABILITIES.map((c) => (
            <Card key={c.title} cap={c} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 border border-ink-800 bg-ink-900 px-5 py-4 font-mono text-xs text-ink-400">
          <span className="text-signal-green" aria-hidden>
            ❯
          </span>
          <span className="text-ink-500">also:</span>
          {ALSO.map((item, i) => (
            <span key={item} className="flex items-center gap-2">
              <span className="text-ink-200">{item}</span>
              {i < ALSO.length - 1 && (
                <span className="text-ink-700" aria-hidden>
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ cap }: { cap: Capability }) {
  const Icon = cap.icon;
  return (
    <div className="tui-frame flex flex-col gap-4 p-6 transition-colors hover:border-ink-700">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-ink-700 bg-ink-850 text-forktty">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="font-mono text-base font-medium tracking-tight text-ink-100">
          {cap.title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-ink-300">{cap.body}</p>
      <pre className="mt-auto overflow-x-auto rounded-none border border-ink-800 bg-ink-950 px-3.5 py-2.5 font-mono text-[12px] leading-relaxed text-ink-200">
        <span className="text-ink-500">$</span> {cap.cmd}
      </pre>
    </div>
  );
}

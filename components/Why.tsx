import { CpuIcon, LayersIcon, PlugIcon, ShieldIcon, TerminalIcon, SparkIcon } from "./Icons";

const FEATURES = [
  {
    icon: CpuIcon,
    title: "Rust + GTK/VTE",
    body:
      "Native to Linux. No Electron, no web shell. VTE handles the bytes; GTK draws the chrome.",
  },
  {
    icon: LayersIcon,
    title: "Parallel agent panes",
    body:
      "Tile any number of agents in one window. Each pane is a real PTY — your CLI doesn't know the difference.",
  },
  {
    icon: PlugIcon,
    title: "Bring your own CLI",
    body:
      "Codex, Claude Code, Gemini CLI, aider, custom scripts — anything that runs in a shell, runs in ForkTTY.",
  },
  {
    icon: ShieldIcon,
    title: "Local-first, no telemetry",
    body:
      "Sessions, history, and keys stay on your machine. Nothing is phoned home. Ever.",
  },
  {
    icon: TerminalIcon,
    title: "Terminal-native UX",
    body:
      "Keyboard-first navigation, true color, ligatures, fast scrollback. Behaves like a terminal — because it is one.",
  },
  {
    icon: SparkIcon,
    title: "Forkable by design",
    body:
      "Open source. Auditable. Patch it, ship a fork, or wire your own orchestrator on top.",
  },
];

export function Why() {
  return (
    <section id="why" className="border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col items-start gap-4">
          <span className="h-eyebrow">02 · Why ForkTTY</span>
          <h2 className="h-title max-w-2xl">
            A terminal that respects your workflow — and your subscriptions.
          </h2>
          <p className="max-w-2xl text-ink-300">
            ForkTTY isn&rsquo;t a chat app pretending to be a terminal. It&rsquo;s a
            terminal that happens to be very good at running a dozen coding
            agents at once, on Linux, the way Linux works.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-ink-800 bg-ink-800 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCell key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCell({
  icon: Icon,
  title,
  body,
}: {
  icon: (props: { className?: string }) => React.JSX.Element;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-3 bg-ink-900/80 p-6">
      <Icon className="h-5 w-5 text-ember" />
      <h3 className="font-display text-base text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-300">{body}</p>
    </div>
  );
}

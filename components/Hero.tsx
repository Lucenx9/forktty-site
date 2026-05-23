import { ArrowRight, GitHubIcon, DownloadIcon } from "./Icons";
import { REPO_HTML_URL } from "@/lib/github";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 ascii-grid opacity-60 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent_80%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[420px] w-[800px] -translate-x-1/2 bg-radial-ember blur-2xl"
      />

      <div className="section pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="flex flex-col items-start gap-6">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Early alpha · Linux only
          </span>

          <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl">
            A terminal built for running
            <span className="block text-ember-soft">coding agents in parallel.</span>
          </h1>

          <p className="max-w-2xl text-base text-ink-200 sm:text-lg">
            ForkTTY is a Linux-native GTK/VTE terminal in Rust. Spin up
            Codex, Claude Code, Gemini CLI, or any custom agent side by side —
            with your own subscriptions, your own keys, on your own machine.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a href="#download" className="btn-primary">
              <DownloadIcon className="h-4 w-4" />
              Get the latest release
            </a>
            <a
              href={REPO_HTML_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-secondary"
            >
              <GitHubIcon className="h-4 w-4" />
              View source
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </a>
          </div>

          <ul className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-2 text-sm text-ink-300 sm:grid-cols-4">
            <FeatureBullet label="Rust + GTK/VTE" />
            <FeatureBullet label="Local-first" />
            <FeatureBullet label="No telemetry" />
            <FeatureBullet label="BYO CLI / subscription" />
          </ul>
        </div>

        <HeroFrame />
      </div>
    </section>
  );
}

function FeatureBullet({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className="h-1 w-1 rounded-full bg-ember" />
      <span>{label}</span>
    </li>
  );
}

function HeroFrame() {
  return (
    <div className="mt-14 sm:mt-20">
      <div className="terminal-frame overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-800/80 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
            ~/projects/forktty · 3 panes
          </span>
          <span className="font-mono text-[11px] text-ink-500">v0.0.x alpha</span>
        </div>

        <div className="grid grid-cols-1 divide-y divide-ink-800/80 md:grid-cols-3 md:divide-x md:divide-y-0">
          <PaneMock
            title="codex · plan"
            lines={[
              { text: "$ codex --plan refactor/auth", tone: "prompt" },
              { text: "▌ scanning 142 files...", tone: "muted" },
              { text: "→ propose: split AuthProvider", tone: "agent" },
              { text: "→ add tests for token refresh", tone: "agent" },
              { text: "ready ▮", tone: "muted" },
            ]}
          />
          <PaneMock
            title="claude code · edit"
            lines={[
              { text: "$ claude --resume", tone: "prompt" },
              { text: "applying patch · src/auth/*", tone: "muted" },
              { text: "+ 84  − 12", tone: "diff" },
              { text: "running cargo test...", tone: "muted" },
              { text: "all green ✓", tone: "ok" },
            ]}
          />
          <PaneMock
            title="gemini cli · review"
            lines={[
              { text: "$ gemini review", tone: "prompt" },
              { text: "model: gemini-2.5-pro", tone: "muted" },
              { text: "‣ flagged: race in refresh", tone: "warn" },
              { text: "‣ suggest: mutex on store", tone: "warn" },
              { text: "ok ▮", tone: "muted" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

type Tone = "prompt" | "muted" | "agent" | "diff" | "ok" | "warn";

function PaneMock({ title, lines }: { title: string; lines: { text: string; tone: Tone }[] }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 border-b border-ink-800/80 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-300">
        <span className="h-1.5 w-1.5 rounded-full bg-ember" />
        {title}
      </div>
      <div className="space-y-1.5 px-4 py-3 font-mono text-[12.5px] leading-relaxed">
        {lines.map((l, i) => (
          <p key={i} className={toneClass(l.tone)}>
            {l.text}
          </p>
        ))}
      </div>
    </div>
  );
}

function toneClass(tone: Tone): string {
  switch (tone) {
    case "prompt":
      return "text-ink-100";
    case "muted":
      return "text-ink-400";
    case "agent":
      return "text-signal-cyan";
    case "diff":
      return "text-signal-green";
    case "ok":
      return "text-signal-green";
    case "warn":
      return "text-signal-yellow";
    default:
      return "text-ink-200";
  }
}

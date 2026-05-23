const ITEMS = [
  {
    q: "What is ForkTTY, in one sentence?",
    a: "A Linux-native GTK/VTE terminal, written in Rust, designed to run multiple coding agents — like Codex, Claude Code, or Gemini CLI — side by side.",
  },
  {
    q: "Does ForkTTY ship with an AI model?",
    a: "No. ForkTTY is bring-your-own-CLI: you install the agent of your choice, authenticate with your own keys or subscription, and ForkTTY just hosts the PTYs. Nothing is proxied.",
  },
  {
    q: "Why GTK/VTE instead of a web stack?",
    a: "VTE is the same terminal widget that powers GNOME Terminal and Tilix. It's fast, faithful to the xterm spec, and lets us focus on the orchestration layer instead of reimplementing a terminal in JavaScript.",
  },
  {
    q: "Will there be a macOS or Windows build?",
    a: "Not in alpha. ForkTTY is unapologetically Linux-first; portability isn't a near-term goal.",
  },
  {
    q: "Is anything sent to a server?",
    a: "No. ForkTTY itself has no telemetry, no auto-update server, no analytics. Agent CLIs talk to whatever endpoint you configure them to.",
  },
  {
    q: "Can I script it / extend it?",
    a: "Yes. It's open source under a permissive license. Fork it, add panes, wire your own orchestrator on top — that's exactly the point.",
  },
  {
    q: "AppImage or .deb?",
    a: "If you're on Debian/Ubuntu, prefer the .deb — it's the most tested path. AppImage works on most distros but is experimental in this alpha.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col items-start gap-4">
          <span className="h-eyebrow">06 · FAQ</span>
          <h2 className="h-title">Common questions.</h2>
        </div>

        <div className="mt-12 divide-y divide-ink-800 overflow-hidden rounded-xl border border-ink-800">
          {ITEMS.map((item, i) => (
            <details
              key={i}
              className="group bg-ink-900/60 open:bg-ink-900/80"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-5 text-base text-white">
                <span className="font-display tracking-tight">{item.q}</span>
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink-700 text-ink-300 transition-transform group-open:rotate-45"
                >
                  +
                </span>
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

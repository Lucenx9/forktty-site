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
    a: "Yes. ForkTTY is open source under AGPL-3.0. Fork it, add panes, wire your own orchestrator on top — that's exactly the point.",
  },
  {
    q: "AppImage or .deb?",
    a: "If you're on Debian/Ubuntu, prefer the .deb — it's the most tested path. AppImage is an experimental Linux build and may not work on every distro yet.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col items-start gap-4">
          <h2 className="h-title">Common questions</h2>
        </div>

        <div className="mt-12 divide-y divide-ink-800 overflow-hidden rounded-md border border-ink-800">
          {ITEMS.map((item, i) => (
            <details key={i} className="group bg-ink-900">
              <summary className="flex cursor-pointer list-none items-start gap-6 px-6 py-5 text-base text-white hover:bg-ink-850">
                <span className="font-display tracking-tight">{item.q}</span>
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

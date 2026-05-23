export function AlphaNotes() {
  return (
    <section id="alpha" className="border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4">
            <h2 className="h-title">This is early software.</h2>
            <p className="text-ink-300">
              ForkTTY is in early alpha. Expect rough edges, breaking changes,
              and the occasional crash. We&rsquo;d rather ship honestly than
              ship a polished facade.
            </p>
            <p className="text-ink-300">
              If you hit something, please open an issue on GitHub — minimal
              repro &gt; long thread.
            </p>
          </div>

          <div className="terminal-frame p-6 sm:p-8">
            <ul className="space-y-4 text-sm">
              <NoteRow tone="yellow" label="experimental">
                AppImage builds are best-effort and not yet signed. Prefer the
                .deb if you&rsquo;re on Debian/Ubuntu.
              </NoteRow>
              <NoteRow tone="yellow" label="breaking">
                Config format, keybinds, and CLI flags will change without
                migration paths during alpha.
              </NoteRow>
              <NoteRow tone="cyan" label="linux only">
                No macOS, no Windows, no WSL build. Wayland and X11 both work
                via GTK4.
              </NoteRow>
              <NoteRow tone="green" label="no telemetry">
                ForkTTY does not collect or transmit usage data. Crashes stay
                local unless you choose to share them.
              </NoteRow>
              <NoteRow tone="cyan" label="byo keys">
                Agent CLIs use your own credentials and subscriptions. ForkTTY
                never proxies your prompts.
              </NoteRow>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function NoteRow({
  tone,
  label,
  children,
}: {
  tone: "yellow" | "cyan" | "green";
  label: string;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "yellow"
      ? "border-signal-yellow/40 text-signal-yellow"
      : tone === "cyan"
        ? "border-signal-cyan/40 text-signal-cyan"
        : "border-signal-green/40 text-signal-green";

  return (
    <li className="flex flex-col gap-2 border-b border-ink-800/80 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:gap-4">
      <span
        className={`chip shrink-0 ${toneClass}`}
      >
        {label}
      </span>
      <span className="text-ink-200">{children}</span>
    </li>
  );
}

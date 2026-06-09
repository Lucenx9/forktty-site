import { PaneBar } from "./PaneBar";

export function AlphaNotes() {
  return (
    <section
      id="alpha"
      data-pane
      data-index="06"
      data-label="alpha"
      className="pane scroll-mt-16"
    >
      <div className="section py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4">
            <PaneBar index="06" label="alpha" />
            <h2 className="h-title">This is early software.</h2>
            <p className="text-ink-300">
              ForkTTY is in early alpha. Expect breaking changes between
              releases, unsigned builds, and the occasional crash.
            </p>
            <p className="text-ink-300">
              If you hit something, please open an issue on GitHub — minimal
              repro &gt; long thread.
            </p>
          </div>

          <div className="tui-frame p-6 sm:p-8">
            <ul className="space-y-4 text-sm">
              <NoteRow label="experimental">
                The current alpha.6 packages still ship the earlier GTK/VTE
                renderer — the GTK/Ghostty runtime on main lands with the next
                release. The browser pane remains a source-only experiment
                behind <code>--features browser</code>. The AppImage is
                unsigned — verify it against SHA256SUMS before running.
              </NoteRow>
              <NoteRow label="breaking">
                Config format, keybinds, and CLI flags will change without
                migration paths during alpha.
              </NoteRow>
              <NoteRow label="linux only">
                No macOS, no Windows, no WSL build. Wayland and X11 both work
                via GTK4.
              </NoteRow>
              <NoteRow label="no telemetry">
                ForkTTY does not collect or transmit usage data. Crashes stay
                local unless you choose to share them.
              </NoteRow>
              <NoteRow label="byo keys">
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
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-3 border-b border-ink-800/80 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:gap-4">
      <span className="chip shrink-0">{label}</span>
      <span className="text-ink-200">{children}</span>
    </li>
  );
}

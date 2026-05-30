import Image from "next/image";

export function Screenshot() {
  return (
    <section id="screenshot" className="border-t border-ink-800/60">
      <div className="section py-16 sm:py-20">
        <div className="flex flex-col items-start gap-4">
          <span className="h-eyebrow">SCREENSHOT</span>
          <h2 className="h-title max-w-2xl">
            Terminals and a browser in one tiling layout.
          </h2>
          <p className="max-w-2xl text-ink-300">
            Each workspace holds a tree of panes — terminals running agents, and
            optional WebKitGTK browser panes — switched with one shortcut. Agent
            status from the hooks shows up in the sidebar instead of scrolling
            past in a pane.
          </p>
        </div>

        <figure className="mt-12">
          <div className="rounded-none border border-ink-800 bg-gradient-to-br from-ink-850 to-ink-950 p-2 shadow-panel sm:p-4">
            <div className="relative overflow-hidden border border-ink-700 bg-ink-950">
              <Image
                src="/forktty-alpha6.png"
                alt="ForkTTY on Linux: a workspace sidebar lists 'main' (active, 5 panes) plus workspace-2 through -6, with a 'Claude: Ready' status line. The window tiles four terminal panes labelled 'simone' alongside an embedded WebKitGTK browser pane showing google.com with its own back/forward and address bar. A bottom status bar reads 'main · ~ · Pane 2/5 · Ctrl+Shift+P'."
                width={2560}
                height={1394}
                quality={95}
                priority
                className="relative block h-auto w-full"
                sizes="(min-width: 1024px) 1100px, 100vw"
              />
            </div>
          </div>
          <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-ink-400">
            <span className="w-full sm:w-auto">forktty · GTK4 / VTE · Linux</span>
            <span className="w-full sm:w-auto">workspaces · tiling panes · agents + browser</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

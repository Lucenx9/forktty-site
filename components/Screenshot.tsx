import Image from "next/image";

export function Screenshot() {
  return (
    <section id="screenshot" className="border-t border-ink-800/60">
      <div className="section py-16 sm:py-20">
        <div className="flex flex-col items-start gap-4">
          <span className="h-eyebrow">SCREENSHOT</span>
          <h2 className="h-title max-w-2xl">
            Agent terminals in one tiling layout.
          </h2>
          <p className="max-w-2xl text-ink-300">
            Each workspace holds a tree of Ghostty panes and pane tabs for agents,
            shells, and long-running tasks. Hook status shows up in the sidebar
            instead of getting buried in scrollback.
          </p>
        </div>

        <figure className="mt-12">
          <div className="rounded-none border border-ink-800 bg-gradient-to-br from-ink-850 to-ink-950 p-2 shadow-panel sm:p-4">
            <div className="relative overflow-hidden border border-ink-700 bg-ink-950">
              <Image
                src="/forktty-alpha6.png"
                alt="ForkTTY on Linux showing a workspace sidebar with project workspaces, a top bar, pane tabs, and four tiled terminal panes with the focused pane outlined in orange."
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
            <span className="w-full sm:w-auto">forktty · GTK4 / Ghostty · Linux</span>
            <span className="w-full sm:w-auto">workspaces · tabs · tiling panes · agents</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

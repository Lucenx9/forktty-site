import Image from "next/image";
import { PaneBar } from "./PaneBar";

export function Screenshot() {
  return (
    <section
      id="screenshot"
      data-pane
      data-index="02"
      data-label="screenshot"
      className="pane scroll-mt-16"
    >
      <div className="section py-16 sm:py-20">
        <div className="flex flex-col items-start gap-4">
          <PaneBar index="02" label="screenshot" />
          <h2 className="h-title max-w-2xl">
            Agent terminals in one tiling layout.
          </h2>
          <p className="max-w-2xl text-ink-300">
            Each workspace holds a tree of Ghostty panes and pane tabs for
            agents, shells, and long-running tasks. Hook status shows up in the
            sidebar instead of getting buried in scrollback.
          </p>
        </div>

        <figure className="group mt-12">
          {/* window-framed product shot, echoing the hero's faux window */}
          <div className="overflow-hidden rounded-none border border-ink-700 bg-ink-900/70 shadow-panel">
            <div className="flex items-center gap-2 border-b border-ink-800 bg-ink-850/80 px-3 py-2 font-mono text-[11px] text-ink-400">
              <span className="text-ink-500" aria-hidden>
                ≡
              </span>
              <span className="text-ink-200">forktty</span>
              <span className="hidden text-ink-600 sm:inline">
                · 4 panes · main
              </span>
              <span className="ml-auto flex items-center gap-3 text-ink-600" aria-hidden>
                <span>—</span>
                <span>☐</span>
                <span className="text-ink-500">✕</span>
              </span>
            </div>
            <div className="relative overflow-hidden border-t border-ink-800/0 bg-ink-950">
              <span className="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-forktty/0 transition-all duration-500 group-hover:ring-forktty/40" />
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
          <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-ink-500">
            <span className="w-full sm:w-auto">forktty · GTK4 / Ghostty · Linux</span>
            <span className="w-full sm:w-auto">
              workspaces · tabs · tiling panes · agents
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

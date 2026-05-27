import Image from "next/image";

export function Screenshot() {
  return (
    <section id="screenshot" className="border-t border-ink-800/60">
      <div className="section py-16 sm:py-20">
        <div className="flex flex-col items-start gap-4">
          <span className="h-eyebrow">SCREENSHOT</span>
          <h2 className="h-title max-w-2xl">
            One window. Many workspaces. Many agents.
          </h2>
          <p className="max-w-2xl text-ink-300">
            ForkTTY on Linux. Each workspace owns a tiling pane layout —
            switch with a single shortcut and pick up exactly where you left
            off.
          </p>
        </div>

        <figure className="mt-12">
          <div className="relative overflow-hidden rounded-none border border-ink-800 bg-ink-900">
            <Image
              src="/forktty-gtk-ubuntu.png"
              alt="ForkTTY GTK terminal on Linux: a workspace sidebar lists 'main' (active, 5 panes) plus workspace-2, -3 and -4 under ~/forktty. The window holds three terminal panes — one on the left, two stacked on the right — each running the FORGE agent on gpt-5.5. A bottom status bar reads 'main · ~ · Pane 1/3 · Ctrl+Shift+P'."
              width={1600}
              height={1000}
              priority
              className="relative h-auto w-full"
              sizes="(min-width: 1024px) 960px, 100vw"
            />
          </div>
          <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-ink-400">
            <span className="w-full sm:w-auto">forktty · GTK4 / VTE · Linux</span>
            <span className="w-full sm:w-auto">workspaces · tiling panes · per-pane agents</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

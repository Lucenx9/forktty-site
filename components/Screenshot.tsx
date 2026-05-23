import Image from "next/image";

export function Screenshot() {
  return (
    <section id="screenshot" className="border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col items-start gap-4">
          <h2 className="h-title max-w-2xl">
            One window. Many workspaces. Many agents.
          </h2>
          <p className="max-w-2xl text-ink-300">
            Real ForkTTY on Ubuntu. Each workspace owns a tiling pane layout —
            switch with a single shortcut and pick up exactly where you left
            off.
          </p>
        </div>

        <figure className="mt-12">
          <div className="relative overflow-hidden rounded-md border border-ink-800 bg-ink-900">
            <Image
              src="/forktty-gtk-ubuntu.png"
              alt="ForkTTY GTK terminal on Ubuntu, showing five workspaces in the sidebar and three terminal panes — one main pane on the left and two stacked panes on the right. The active 'main' workspace is highlighted in purple. Status badges on other workspaces read ALPHA, INPUT, and RUNNING."
              width={1600}
              height={1000}
              priority
              className="relative h-auto w-full"
              sizes="(min-width: 1024px) 960px, 100vw"
            />
          </div>
          <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-400">
            <span className="font-mono">forktty · GTK4 / VTE · Ubuntu</span>
            <span>alpha · workspaces + tiling panes</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

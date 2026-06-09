import Image from "next/image";
import { GitHubIcon, DownloadIcon } from "./Icons";
import { HeroHotkeys } from "./HeroHotkeys";
import { REPO_HTML_URL } from "@/lib/github";

const ART = `  ______ ____  _____  _  _________ _________     __
 |  ____/ __ \\|  __ \\| |/ /__   __|__   __\\ \\   / /
 | |__ | |  | | |__) | ' /   | |     | |   \\ \\_/ /
 |  __|| |  | |  _  /|  <    | |     | |    \\   /
 | |   | |__| | | \\ \\| . \\   | |     | |     | |
 |_|    \\____/|_|  \\_\\_|\\_\\  |_|     |_|     |_|`;

export function Hero() {
  return (
    <section id="top" className="scroll-mt-16">
      <div className="section flex flex-col items-center gap-7 pt-14 pb-16 text-center sm:pt-20">
        {/* the product introduces itself: a terminal window, Ghostty-style */}
        <div
          className="reveal w-full max-w-3xl overflow-hidden rounded-none border border-ink-700 bg-ink-925/80 shadow-panel"
          style={{ animationDelay: "40ms" }}
        >
          <div className="flex items-center gap-3 border-b border-ink-800 bg-ink-850/80 px-3 py-2 font-mono text-[11px] text-ink-400">
            <span className="text-ink-500" aria-hidden>
              ≡
            </span>
            <span className="text-ink-200">forktty</span>
            <span className="text-ink-600">· early alpha</span>
            <span className="ml-auto flex items-center gap-3 text-ink-600" aria-hidden>
              <span>—</span>
              <span>☐</span>
              <span className="text-ink-500">✕</span>
            </span>
          </div>

          <div className="flex flex-col items-center gap-5 px-4 py-10 sm:py-12">
            <pre
              aria-hidden
              className="text-left font-mono font-semibold leading-[1.22] text-forktty"
              style={{ fontSize: "clamp(8px, 2.4vw, 18px)" }}
            >
              {ART}
            </pre>
            <p className="font-mono text-[13px] text-ink-300 sm:text-sm">
              <span className="text-signal-magenta">~</span>{" "}
              <span className="text-signal-green">❯</span>{" "}
              <span className="text-ink-100">
                stop babysitting your coding agents
              </span>
              <span className="ml-1 inline-block h-[1.05em] w-[0.55ch] translate-y-[0.18em] animate-blink bg-forktty" />
            </p>
          </div>
        </div>

        <h1
          className="reveal max-w-2xl font-sans text-base leading-relaxed text-ink-300 sm:text-lg"
          style={{ animationDelay: "150ms" }}
        >
          ForkTTY is a multi-agent terminal for Linux that runs Codex, Claude
          Code, Gemini CLI, or any shell agent in tiling panes — scriptable
          over a local socket, backed by git worktrees.
        </h1>

        <div
          className="reveal flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "250ms" }}
        >
          <HeroHotkeys />
          <a href="#download" className="btn-primary">
            <DownloadIcon className="h-4 w-4" />
            Download for Linux
            <kbd
              aria-hidden
              className="ml-1 border border-ink-950/40 px-1.5 font-mono text-[10px] leading-[1.5] opacity-80"
            >
              D
            </kbd>
          </a>
          <a
            href={REPO_HTML_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-secondary"
          >
            <GitHubIcon className="h-4 w-4" />
            View source
            <kbd
              aria-hidden
              className="ml-1 border border-ink-600 px-1.5 font-mono text-[10px] leading-[1.5] text-ink-400"
            >
              G
            </kbd>
          </a>
        </div>

        <figure
          className="reveal mt-8 w-full max-w-5xl"
          style={{ animationDelay: "350ms" }}
        >
          <div className="overflow-hidden rounded-none border border-ink-700 bg-ink-900/70 shadow-panel">
            <Image
              src="/forktty-alpha6.png"
              alt="ForkTTY on Linux showing a workspace sidebar, pane tabs, and four tiled terminal panes with the focused pane outlined in orange."
              width={2560}
              height={1394}
              quality={95}
              priority
              className="block h-auto w-full"
              sizes="(min-width: 1024px) 1024px, 100vw"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}

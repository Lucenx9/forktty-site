import Image from "next/image";
import { GitHubIcon, DownloadIcon } from "./Icons";
import { HeroHotkeys } from "./HeroHotkeys";
import { REPO_HTML_URL } from "@/lib/github";

export function Hero() {
  return (
    <section id="top" className="scroll-mt-16">
      <div className="section flex flex-col items-center gap-6 pt-20 pb-16 text-center sm:pt-28">
        <p
          className="reveal font-mono text-xs tracking-[0.05em] text-ink-400"
          style={{ animationDelay: "40ms" }}
        >
          <span className="text-signal-magenta">~</span>{" "}
          <span className="text-signal-green">❯</span>{" "}
          <span className="text-ink-200">forktty</span>
          <span className="text-ink-500"> · early alpha</span>
        </p>

        <h1
          className="reveal font-display text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink-100 sm:text-6xl lg:text-[4.2rem]"
          style={{ animationDelay: "110ms" }}
        >
          Stop babysitting
          <br />
          your coding <span className="text-forktty">agents</span>
          <span className="ml-2 inline-block h-[0.78em] w-[0.5ch] translate-y-[0.06em] animate-blink bg-forktty" />
        </h1>

        <p
          className="reveal max-w-xl font-sans text-base leading-relaxed text-ink-300 sm:text-lg"
          style={{ animationDelay: "210ms" }}
        >
          A multi-agent terminal for Linux. Codex, Claude Code, Gemini CLI, or
          any shell agent in tiling panes — scriptable over a local socket,
          backed by git worktrees.
        </p>

        <div
          className="reveal mt-1 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "300ms" }}
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

        <div
          className="reveal flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-2 font-mono text-[11px] tracking-[0.04em] text-ink-500"
          style={{ animationDelay: "400ms" }}
        >
          <span>linux/x86_64</span>
          <span aria-hidden>·</span>
          <span>GTK4 / Ghostty</span>
          <span aria-hidden>·</span>
          <span>AGPL-3.0</span>
          <span aria-hidden>·</span>
          <span className="text-signal-green">no telemetry</span>
        </div>

        <figure
          className="reveal mt-10 w-full max-w-5xl"
          style={{ animationDelay: "500ms" }}
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

import Image from "next/image";
import { GitHubIcon, DownloadIcon } from "./Icons";
import { HeroHotkeys } from "./HeroHotkeys";
import { REPO_HTML_URL } from "@/lib/github";

const CAPABILITIES = ["Agent HUD", "Git worktrees", "Local socket", "MCP"];

export function Hero() {
  return (
    <section id="top" className="scroll-mt-16">
      <div className="section flex flex-col items-center gap-8 pt-16 pb-16 text-center sm:pt-20">
        <div className="reveal flex flex-col items-center gap-6" style={{ animationDelay: "40ms" }}>
          <div className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-400">
            <Image
              src="/forktty.svg"
              alt=""
              width={34}
              height={34}
              className="h-8 w-8"
              priority
            />
            <span>Linux-native terminal</span>
            <span className="text-ink-600" aria-hidden>
              /
            </span>
            <span className="text-forktty">v0.2 alpha</span>
          </div>

          <h1 className="max-w-4xl font-display text-[3.1rem] font-semibold leading-[0.95] text-ink-100 sm:text-[5.6rem]">
            ForkTTY
          </h1>

          <p className="max-w-3xl text-balance text-base leading-relaxed text-ink-300 sm:text-xl">
            Coordinate Codex, Claude Code, Antigravity, OpenCode, and shell
            agents in tiled GTK/Ghostty workspaces — with git worktrees, a local
            socket API, MCP, and resume-aware notifications.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {CAPABILITIES.map((capability) => (
              <span key={capability} className="chip">
                {capability}
              </span>
            ))}
          </div>
        </div>

        <div
          className="reveal flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "160ms" }}
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
          className="reveal mt-6 w-full max-w-6xl"
          style={{ animationDelay: "260ms" }}
        >
          <div className="overflow-hidden rounded-none border border-ink-700 bg-ink-900/70 shadow-panel">
            <Image
              src="/screenshots/forktty-app.png"
              alt="ForkTTY on Linux showing a workspace sidebar, pane tabs, and four tiled terminal panes with the focused pane outlined in orange."
              width={1920}
              height={1034}
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

import Image from "next/image";
import { GitHubIcon, DownloadIcon } from "./Icons";
import { HeroHotkeys } from "./HeroHotkeys";
import { REPO_HTML_URL } from "@/lib/github";

const CAPABILITIES = ["Agent HUD", "Git worktrees", "Local socket", "MCP"];

export function Hero() {
  return (
    <section id="top" className="scroll-mt-16" aria-labelledby="hero-title">
      <div className="section flex flex-col items-center gap-7 pt-14 pb-14 text-center sm:gap-8 sm:pt-20 sm:pb-16">
        <div className="reveal flex flex-col items-center gap-6" style={{ animationDelay: "40ms" }}>
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.14em] text-ink-400 sm:tracking-[0.16em]">
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

          <h1
            id="hero-title"
            className="max-w-4xl font-display text-[3.1rem] font-semibold leading-[0.95] text-ink-100 sm:text-[5.6rem]"
          >
            <span className="hero-wordmark">
              forktty
              <span className="hero-cursor" aria-hidden="true" />
            </span>
          </h1>

          <p className="max-w-3xl text-balance text-base leading-relaxed text-ink-300 sm:text-xl">
            Coordinate Codex, Claude Code, Pi, Antigravity, OpenCode, and shell
            agents from one Linux-native terminal. ForkTTY keeps tiled
            GTK/Ghostty panes, git worktrees, local socket automation, MCP, and
            resume-aware notifications in one place.
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
          className="reveal flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
          style={{ animationDelay: "160ms" }}
        >
          <HeroHotkeys />
          <a href="#download" className="btn-primary w-full max-w-xs sm:w-auto">
            <DownloadIcon className="h-4 w-4" />
            Download for Linux
            <kbd
              aria-hidden
              className="ml-1 border border-ink-950/40 px-1.5 font-mono text-[10px] leading-[1.5] opacity-80"
            >
              Shift+D
            </kbd>
          </a>
          <a
            href={REPO_HTML_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-secondary w-full max-w-xs sm:w-auto"
          >
            <GitHubIcon className="h-4 w-4" />
            View on GitHub
            <kbd
              aria-hidden
              className="ml-1 border border-ink-600 px-1.5 font-mono text-[10px] leading-[1.5] text-ink-400"
            >
              Shift+G
            </kbd>
          </a>
        </div>

        <p
          className="reveal -mt-2 max-w-xl font-mono text-xs leading-relaxed text-ink-400"
          style={{ animationDelay: "220ms" }}
        >
          AppImage and .deb builds for Linux x86_64 alpha. Verify SHA256SUMS
          before running.
        </p>

        <figure
          className="reveal mt-2 w-[min(calc(100vw-2rem),88rem)] max-w-[88rem]"
          style={{ animationDelay: "300ms" }}
        >
          <div className="hero-shot overflow-hidden rounded-none border border-ink-700 bg-ink-900/70 shadow-panel">
            <div
              aria-hidden="true"
              className="flex items-center justify-between gap-4 border-b border-ink-800 bg-ink-925 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em]"
            >
              <span className="truncate text-ink-300">forktty / main</span>
              <span className="hidden text-ink-500 sm:inline">
                router rail / workflow feed / focused
              </span>
            </div>
            <Image
              src="/screenshots/forktty-app-focus.png"
              alt="ForkTTY on Linux showing a workspace sidebar, embedded Ghostty terminal, Router rail, and bottom workflow feed."
              width={1360}
              height={820}
              quality={95}
              priority
              className="block h-[13.5rem] w-full object-cover object-[58%_top] sm:h-auto sm:object-contain"
              sizes="(min-width: 1408px) 1408px, 100vw"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}

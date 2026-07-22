import Image from "next/image";
import { GitHubIcon, DownloadIcon } from "./Icons";
import { HeroHotkeys } from "./HeroHotkeys";
import { REPO_HTML_URL } from "@/lib/github";

const CAPABILITIES = ["Ghostty panes", "Workspaces", "Git worktrees", "Local socket"];

export function Hero() {
  return (
    <section id="top" className="scroll-mt-16" aria-labelledby="hero-title">
      <div className="section flex flex-col items-center gap-8 pb-16 pt-20 text-center sm:gap-10 sm:pb-24 sm:pt-28">
        <div className="reveal flex flex-col items-center gap-6" style={{ animationDelay: "40ms" }}>
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border border-ink-800 bg-ink-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.13em] text-ink-400">
            <Image
              src="/forktty.svg"
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
              priority
            />
            <span>Linux-native</span>
            <span className="text-ink-600" aria-hidden>
              ·
            </span>
            <span>Open source</span>
            <span className="text-ink-600" aria-hidden>
              ·
            </span>
            <span className="text-forktty">v0.2 alpha</span>
          </div>

          <h1
            id="hero-title"
            className="max-w-5xl font-display text-[3.2rem] font-medium leading-[0.98] tracking-[-0.055em] text-ink-100 sm:text-[5.4rem]"
          >
            <span className="hero-wordmark">
              forktty
              <span className="hero-cursor" aria-hidden="true" />
            </span>
            <span className="block">The Linux workspace</span>
            <span className="block text-ink-300">for coding agents.</span>
          </h1>

          <p className="max-w-3xl text-balance text-base leading-relaxed text-ink-300 sm:text-lg sm:leading-8">
            Run Codex, Claude Code, Pi, Antigravity, OpenCode, Grok Build, and
            shell tools side by side in one native GTK/Ghostty workbench. Keep
            panes, worktrees, notifications, and resume-aware status visible.
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
          className="reveal -mt-3 max-w-xl font-mono text-[11px] leading-relaxed text-ink-500"
          style={{ animationDelay: "220ms" }}
        >
          AppImage and .deb builds for Linux x86_64 alpha. Verify SHA256SUMS
          before running.
        </p>

        <figure
          className="reveal w-full max-w-6xl overflow-hidden rounded-lg border border-ink-800 bg-ink-900/80 p-1 shadow-panel"
          style={{ animationDelay: "280ms" }}
        >
          <Image
            src="/screenshots/forktty-workspace.png"
            alt="ForkTTY workspace with three split terminals and a compact content-first titlebar"
            width={1410}
            height={870}
            sizes="(min-width: 1280px) 1152px, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 3rem)"
            className="h-auto w-full rounded-md"
            quality={95}
            priority
          />
        </figure>
      </div>
    </section>
  );
}

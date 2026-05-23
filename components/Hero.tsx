import { ArrowRight, GitHubIcon, DownloadIcon } from "./Icons";
import { REPO_HTML_URL } from "@/lib/github";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 ascii-grid opacity-30"
      />

      <div className="section pt-16 pb-10 sm:pt-24 sm:pb-14">
        <div className="flex max-w-3xl flex-col items-start gap-6">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-forktty" />
            Early alpha · Linux only
          </span>

          <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Multi-agent terminal for Linux.
          </h1>

          <p className="max-w-2xl text-base text-ink-200 sm:text-lg">
            A GTK/VTE terminal written in Rust. Each workspace is a tiling
            pane layout you can dedicate to one agent — Codex, Claude Code,
            Gemini CLI, or anything else that runs in a shell. Your keys,
            your subscription, your machine.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a href="#download" className="btn-primary">
              <DownloadIcon className="h-4 w-4" />
              Download for Linux
            </a>
            <a
              href={REPO_HTML_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-secondary"
            >
              <GitHubIcon className="h-4 w-4" />
              View source
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

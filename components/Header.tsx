import Link from "next/link";
import Image from "next/image";
import { GitHubIcon } from "./Icons";
import { REPO_HTML_URL } from "@/lib/github";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/60 bg-ink-950/70 backdrop-blur">
      <div className="section flex h-14 items-center justify-between">
        <Link href="#top" className="flex items-center gap-2.5">
          <Image
            src="/forktty.svg"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6"
            priority
          />
          <span className="font-display text-sm tracking-tight text-white">
            forktty
            <span className="text-forktty">_</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 text-sm text-ink-300 md:flex">
          <a href="#download" className="hover:text-white">Download</a>
          <a href="#why" className="hover:text-white">Why</a>
          <a href="#workflows" className="hover:text-white">Workflows</a>
          <a href="#install" className="hover:text-white">Install</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={REPO_HTML_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-ghost"
            aria-label="ForkTTY on GitHub"
          >
            <GitHubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Source</span>
          </a>
          <a href="#download" className="btn-primary text-xs sm:text-sm">
            Download for Linux
          </a>
        </div>
      </div>
    </header>
  );
}


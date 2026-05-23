import Link from "next/link";
import { GitHubIcon } from "./Icons";
import { REPO_HTML_URL } from "@/lib/github";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/60 bg-ink-950/70 backdrop-blur">
      <div className="section flex h-14 items-center justify-between">
        <Link href="#top" className="flex items-center gap-2.5">
          <Logo className="h-6 w-6 text-ember" />
          <span className="font-display text-sm tracking-tight text-white">
            forktty
            <span className="text-ember">_</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-ink-300 md:flex">
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
            Download
          </a>
        </div>
      </div>
    </header>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 5h16v3H4z" />
      <path d="m6 14 3-3-3-3" />
      <path d="M12 14h6" />
      <path d="M4 5v14h16V5" />
    </svg>
  );
}

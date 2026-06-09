"use client";

import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { GitHubIcon } from "./Icons";
import { REPO_HTML_URL } from "@/lib/github";

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function Header() {
  const isScrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur transition-colors duration-200 ${
        isScrolled
          ? "border-ink-800 bg-ink-950/80"
          : "border-transparent bg-ink-950/40"
      }`}
    >
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
          <span className="font-mono text-sm font-semibold tracking-tight text-ink-100">
            forktty
            <span className="animate-blink text-forktty">_</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 text-sm text-ink-300 md:flex">
          <a href="#features" className="hover:text-forktty">Features</a>
          <a href="#download" className="hover:text-forktty">Download</a>
          <a href="#faq" className="hover:text-forktty">FAQ</a>
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
            <span className="sm:hidden">Download</span>
            <span className="hidden sm:inline">Download for Linux</span>
          </a>
        </div>
      </div>
    </header>
  );
}

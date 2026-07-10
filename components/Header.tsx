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
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-200 ${
        isScrolled
          ? "border-ink-800/90 bg-ink-950/88"
          : "border-transparent bg-ink-950/55"
      }`}
    >
      <div className="section flex h-16 items-center justify-between">
        <Link href="/#top" className="flex items-center gap-2.5">
          <Image
            src="/forktty.svg"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6"
            priority
          />
          <span className="font-sans text-sm font-semibold tracking-[-0.02em] text-ink-100">
            forktty
            <span className="ml-0.5 text-forktty">_</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 text-[13px] font-medium text-ink-400 md:flex">
          <Link href="/#features" className="transition-colors hover:text-ink-100">Features</Link>
          <Link href="/docs" className="transition-colors hover:text-ink-100">Docs</Link>
          <Link href="/#download" className="transition-colors hover:text-ink-100">Download</Link>
          <Link href="/#faq" className="transition-colors hover:text-ink-100">FAQ</Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={REPO_HTML_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-ghost px-3"
            aria-label="ForkTTY on GitHub"
          >
            <GitHubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Source</span>
          </a>
          <Link href="/#download" className="btn-primary min-h-9 px-3.5 text-xs sm:text-sm">
            <span className="sm:hidden">Download</span>
            <span className="hidden sm:inline">Download for Linux</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

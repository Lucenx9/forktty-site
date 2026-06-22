"use client";

import { useEffect } from "react";
import { REPO_HTML_URL } from "@/lib/github";

/** Makes the kbd hints on the hero CTAs real: Shift+D and Shift+G. */
export function HeroHotkeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
      if (
        e.target instanceof HTMLElement &&
        e.target.closest(
          "input, textarea, select, button, a, summary, [contenteditable='true']",
        )
      ) {
        return;
      }
      if (e.key === "d" || e.key === "D") {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document
          .getElementById("download")
          ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      } else if (e.key === "g" || e.key === "G") {
        window.open(REPO_HTML_URL, "_blank", "noopener,noreferrer");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}

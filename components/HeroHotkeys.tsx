"use client";

import { useEffect } from "react";
import { REPO_HTML_URL } from "@/lib/github";

/** Makes the kbd hints on the hero CTAs real: D → download, G → source. */
export function HeroHotkeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea")) return;
      if (e.key === "d" || e.key === "D") {
        document.getElementById("download")?.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === "g" || e.key === "G") {
        window.open(REPO_HTML_URL, "_blank", "noopener,noreferrer");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}

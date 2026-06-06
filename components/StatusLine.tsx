"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Persistent tmux/lualine-style statusline pinned to the bottom of the page.
 * It scroll-spies every [data-pane] section: the one nearest the reading line
 * gets data-active="true" (CSS paints its focused-pane outline) and its path
 * is mirrored here, alongside a scroll-progress bar. Decorative — the real
 * navigation lives in the header — so the whole bar is aria-hidden.
 */
export function StatusLine() {
  const [active, setActive] = useState({ index: "01", label: "~" });
  const [total, setTotal] = useState(8);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const panes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-pane]"),
    );
    if (!panes.length) return;
    setTotal(panes.length);

    let raf = 0;
    let current: HTMLElement | null = null;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        const anchor = vh * 0.35;
        let best: HTMLElement | null = null;
        let bestDist = Infinity;

        for (const p of panes) {
          const r = p.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) continue;
          const dist = Math.abs(r.top - anchor);
          if (dist < bestDist) {
            bestDist = dist;
            best = p;
          }
        }
        if (!best) {
          // nothing straddles the reading line — take the last pane above it
          for (const p of panes) {
            if (p.getBoundingClientRect().top <= anchor) best = p;
          }
          best = best ?? panes[0];
        }

        // Only touch the DOM / React state when the focused pane actually
        // changes — not on every scroll frame.
        if (best !== current) {
          if (current) current.dataset.active = "false";
          best.dataset.active = "true";
          current = best;
          setActive({
            index: best.dataset.index ?? "01",
            label: best.dataset.label ?? "~",
          });
        }

        // The progress bar is a transient, high-frequency value: write it
        // straight to the DOM via a ref instead of re-rendering each frame.
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
        if (progressRef.current) {
          progressRef.current.style.width = `${pct}%`;
        }
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  const totalLabel = String(total).padStart(2, "0");

  return (
    <div className="statusline" aria-hidden>
      <span className="mode">Normal</span>
      <span className="seg text-signal-green">
        <span className="h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse-soft" />
        ready
      </span>
      <span className="seg hidden text-ink-200 sm:flex">~/{active.label}</span>
      <span className="seg text-ink-500">
        {active.index}/{totalLabel}
      </span>

      <span className="ml-auto hidden h-full max-w-[200px] flex-1 items-center px-3 md:flex">
        <span className="relative h-[3px] w-full bg-ink-800">
          <span
            ref={progressRef}
            className="absolute inset-y-0 left-0 bg-forktty"
            style={{ width: "0%" }}
          />
        </span>
      </span>

      <span className="seg hidden lg:flex">linux/x86_64</span>
      <span className="seg hidden sm:flex">AGPL-3.0</span>
      <span className="seg ml-auto pr-4 text-ink-300 md:ml-0">utf-8</span>
    </div>
  );
}

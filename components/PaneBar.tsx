// The title strip stamped at the top of every section, so each one reads as a
// pane in a tiling workspace: [02] ~/why ───────────────────── ❯
export function PaneBar({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div className="pane-bar">
      <span className="text-forktty">[{index}]</span>
      <span className="font-mono text-[11px] normal-case tracking-[0.04em] text-ink-300">
        ~/{label}
      </span>
      <span className="rule" aria-hidden />
      <span className="text-ink-600" aria-hidden>
        ❯
      </span>
    </div>
  );
}

const STEPS = [
  {
    title: "Verify checksums",
    note: "Always do this before running an unknown binary.",
    code: [
      "# Download both the artifact and SHA256SUMS",
      "sha256sum -c SHA256SUMS --ignore-missing",
    ].join("\n"),
  },
  {
    title: "AppImage",
    note: "Portable across most distros. Experimental in this alpha.",
    code: [
      "chmod +x ForkTTY-*.AppImage",
      "./ForkTTY-*.AppImage",
    ].join("\n"),
  },
  {
    title: ".deb package",
    note: "Debian / Ubuntu (and derivatives).",
    code: [
      "sudo apt install ./forktty_*.deb",
      "forktty",
    ].join("\n"),
  },
  {
    title: "Build from source",
    note: "Requires Rust toolchain and GTK4 / VTE 0.74+ development packages.",
    code: [
      "git clone https://github.com/Lucenx9/forktty.git",
      "cd forktty && cargo build --release",
      "./target/release/forktty",
    ].join("\n"),
  },
];

export function Install() {
  return (
    <section id="install" className="border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col items-start gap-4">
          <span className="h-eyebrow">04 · Install &amp; verify</span>
          <h2 className="h-title max-w-2xl">Four commands and you&rsquo;re running.</h2>
          <p className="max-w-2xl text-ink-300">
            ForkTTY is distributed as standard Linux artifacts. No installers,
            no first-run wizard, no account.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {STEPS.map((s, i) => (
            <Step key={s.title} index={i + 1} step={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({
  index,
  step,
}: {
  index: number;
  step: (typeof STEPS)[number];
}) {
  return (
    <div className="terminal-frame flex flex-col gap-4 p-6">
      <div className="flex items-start gap-4">
        <span className="font-mono text-sm text-ember">{String(index).padStart(2, "0")}</span>
        <div>
          <h3 className="font-display text-base text-white">{step.title}</h3>
          <p className="mt-1 text-sm text-ink-300">{step.note}</p>
        </div>
      </div>
      <pre className="overflow-x-auto rounded-md border border-ink-800 bg-ink-950/70 p-4 font-mono text-[12.5px] leading-relaxed text-ink-100">
        {step.code.split("\n").map((line, i) => (
          <div key={i}>
            {line.startsWith("#") ? (
              <span className="text-ink-400">{line}</span>
            ) : (
              <>
                <span className="text-ember-soft">$</span> {line}
              </>
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}

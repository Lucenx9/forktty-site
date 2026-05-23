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
    title: ".deb package",
    note: "Recommended on Debian / Ubuntu and derivatives.",
    code: [
      "sudo apt install ./forktty_*.deb",
      "forktty",
    ].join("\n"),
  },
  {
    title: "AppImage",
    note: "Experimental portable Linux build. Prefer the .deb on Debian/Ubuntu.",
    code: [
      "chmod +x forktty-*.AppImage",
      "./forktty-*.AppImage",
    ].join("\n"),
  },
  {
    title: "Build from source",
    note: "Requires Rust toolchain and GTK4 / VTE 0.74+ development packages.",
    code: [
      "git clone https://github.com/Lucenx9/forktty.git",
      "cd forktty",
      "cargo build -p forktty-ui-gtk --features gtk-vte --release",
      "./target/release/forktty",
    ].join("\n"),
  },
];

export function Install() {
  return (
    <section id="install" className="border-t border-ink-800/60">
      <div className="section py-20 sm:py-24">
        <div className="flex flex-col items-start gap-4">
          <h2 className="h-title max-w-2xl">Install &amp; verify</h2>
          <p className="max-w-2xl text-ink-300">
            ForkTTY is distributed as standard Linux artifacts. No account,
            no cloud setup, no first-run wizard.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {STEPS.map((s) => (
            <Step key={s.title} step={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <div className="terminal-frame flex flex-col gap-4 p-6">
      <div>
        <h3 className="font-display text-base text-white">{step.title}</h3>
        <p className="mt-1 text-sm text-ink-300">{step.note}</p>
      </div>
      <pre className="overflow-x-auto rounded-md border border-ink-800 bg-ink-950 p-4 font-mono text-[12.5px] leading-relaxed text-ink-100">
        {step.code.split("\n").map((line, i) => (
          <div key={i}>
            {line.startsWith("#") ? (
              <span className="text-ink-400">{line}</span>
            ) : (
              <>
                <span className="text-ink-400">$</span> {line}
              </>
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}

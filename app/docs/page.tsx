import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight, GitHubIcon } from "@/components/Icons";
import { RELEASES_HTML_URL, REPO_HTML_URL } from "@/lib/github";
import { SITE_URL } from "@/lib/site";

const REPO_DOCS = `${REPO_HTML_URL}/blob/main`;

type DocBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; lines: string[]; prompt?: boolean }
  | { kind: "table"; columns: [string, string]; rows: Array<[string, string]> };

type DocSection = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  blocks: DocBlock[];
  sources?: Array<{ label: string; href: string }>;
};

const SOURCE_LINKS = [
  { label: "README", href: `${REPO_DOCS}/README.md` },
  { label: "Runtime spec", href: `${REPO_DOCS}/SPEC.md` },
  { label: "Hooks README", href: `${REPO_DOCS}/hooks/README.md` },
  { label: "Privacy", href: `${REPO_DOCS}/PRIVACY.md` },
  { label: "Security", href: `${REPO_DOCS}/SECURITY.md` },
  { label: "Changelog", href: `${REPO_DOCS}/CHANGELOG.md` },
];

const DOC_SECTIONS: DocSection[] = [
  {
    id: "overview",
    eyebrow: "Start here",
    title: "Overview",
    summary:
      "ForkTTY is a Linux-native GTK/Ghostty terminal workspace for coding agents and ordinary shell tools.",
    blocks: [
      {
        kind: "paragraph",
        text: "ForkTTY keeps projects, tabs, split panes, notifications, and git worktrees in one native desktop app. Coding agents run as normal terminal processes: ForkTTY does not route their tasks, own their prompts, manage teams, execute workflow loops, or provide model access.",
      },
      {
        kind: "list",
        items: [
          "Embedded Ghostty-backed terminals with native selection, clipboard, links, and scrollback.",
          "Quiet GTK chrome with a seven-step type scale, a single warm accent, AA-readable muted text, and consistent 4/6/8px radii.",
          "Vertical project sidebar, tabs, split panes, keyboard navigation, drag and drop, and layout restore with each local terminal pane's last live working directory.",
          "OSC and desktop notifications, unread state, attention rings, and a command palette.",
          "Git worktree workspaces and an owner-only local socket for focused automation.",
        ],
      },
    ],
    sources: [
      { label: "README overview", href: `${REPO_DOCS}/README.md#why-forktty` },
      { label: "Architecture review", href: `${REPO_DOCS}/docs/cmux-architecture-review.md` },
    ],
  },
  {
    id: "install-first-run",
    eyebrow: "Quick start",
    title: "Install and first run",
    summary:
      "Use the AppImage for a portable Linux x86_64 build or the .deb on supported Debian-family systems.",
    blocks: [
      {
        kind: "table",
        columns: ["Path", "Use it when"],
        rows: [
          ["AppImage", "Portable install on a modern x86_64 Linux desktop"],
          [".deb", "Debian 13/Trixie+, Ubuntu 24.04 LTS+, or a compatible derivative"],
          ["Source", "You have the Rust, GTK4, libadwaita, Zig, and Ghostty build dependencies"],
        ],
      },
      {
        kind: "code",
        prompt: true,
        lines: [
          "chmod +x ForkTTY-*.AppImage",
          "./ForkTTY-*.AppImage",
          "forktty doctor",
        ],
      },
      {
        kind: "paragraph",
        text: "AppImage auto mode runs a real eager loader compatibility probe with the effective loader environment. Host GTK/libadwaita is used only when both the ForkTTY binary and embedded Ghostty library load; otherwise AppRun selects its bundled fallback. Terminal child environments are sanitized only after the GTK-linked helper has loaded, immediately before it executes the real command.",
      },
      {
        kind: "paragraph",
        text: "Packaging runs ghostty-gtk-lib-probe.sh --ensure --print-path. Every invocation enters the incremental Zig build graph and then verifies every mandatory embedding ABI symbol before the library is accepted.",
      },
      {
        kind: "paragraph",
        text: "Embedded Bash, Zsh, fish, Elvish, and Nushell sessions preserve Ghostty shell integration and TERM=xterm-ghostty. A close request from the Ghostty widget uses ForkTTY's confirmation dialog; socket/API close remains noninteractive.",
      },
      {
        kind: "paragraph",
        text: "ForkTTY is a DBus single-instance app. A second launch delegates to the running process instead of opening a separate application instance.",
      },
      {
        kind: "paragraph",
        text: "When upgrading from a build that included ForkTTY MCP and managed skills, use that older binary's removal dry runs before replacing it. The new binary intentionally does not edit external agent configuration at startup.",
      },
      {
        kind: "code",
        lines: [
          "# Run with the older ForkTTY binary before upgrading",
          "forktty mcp remove --dry-run",
          "forktty mcp remove gemini --dry-run",
          "forktty skills remove --dry-run",
          "forktty mcp remove",
          "forktty mcp remove gemini",
          "forktty skills remove",
        ],
      },
      {
        kind: "paragraph",
        text: "The older skill remover preserves removed installs as sibling forktty-agent-orchestration.bak-* directories. Delete a backup only when it is a real directory, not a symlink, and its SKILL.md contains <!-- forktty-managed-agent-skill -->.",
      },
    ],
    sources: [
      { label: "Download releases", href: RELEASES_HTML_URL },
      { label: "Install guide", href: `${REPO_DOCS}/GETTING_STARTED.md` },
    ],
  },
  {
    id: "daily-use",
    eyebrow: "Workspace",
    title: "Daily use",
    summary: "Use workspaces, tabs, and splits to keep each project and process easy to locate.",
    blocks: [
      {
        kind: "list",
        items: [
          "Open the command palette with Ctrl+Shift+P.",
          "Create tabs and split panes for shells, editors, servers, and coding agents.",
          "Drag pane headers to rearrange panes and use the sidebar to switch projects.",
          "Use notifications and unread markers instead of polling every pane.",
          "Enable optional dtach-backed process persistence if terminal processes must survive a UI restart.",
        ],
      },
      {
        kind: "paragraph",
        text: "Pane chrome is hidden when a workspace contains one pane. That keeps the single-terminal view quiet while preserving headers and dividers where they are useful.",
      },
      {
        kind: "paragraph",
        text: "Pane and tab actions stay bound to the surface that opened them, even if focus changes before activation. Maximize applies only when the real layout has multiple panes, counts tabs as part of one pane, and clears when the layout collapses. While the notification panel is visible it reconciles rows, count, Clear, and Open Latest every 500 ms; Dismiss and Clear refresh immediately. SSH workspace metadata reads ssh:<host> · connected or ssh:<host> · disconnected from local terminal readiness, not a network heartbeat.",
      },
    ],
  },
  {
    id: "agent-integrations",
    eyebrow: "Optional metadata",
    title: "Agent integrations",
    summary:
      "Agents work without setup; optional hooks add lifecycle, attention, focus, and resume metadata.",
    blocks: [
      {
        kind: "paragraph",
        text: "ForkTTY has no provider selector or built-in task router. Launch the agent CLI you want in a pane. The optional Agent HUD is a thin view over lifecycle metadata, not a team or workflow engine.",
      },
      {
        kind: "code",
        prompt: true,
        lines: [
          "forktty agents",
          "forktty agent-health",
          "forktty agent-reclaim-plan",
          "forktty hibernate-agent",
          "forktty reclaim-agent",
          "forktty resume-agent",
        ],
      },
      {
        kind: "list",
        items: [
          "Lifecycle state can be delayed; source, age, and evidence fields distinguish persisted metadata from fresh events.",
          "Non-attention hook notifications are logged without changing lifecycle, so informational notifications after Stop do not revive an idle agent.",
          "Restored agent panes require valid provider resume metadata; invalid session IDs, resume directories, or unsupported providers show a terminal error instead of opening a plain shell.",
          "Suspended is a durable tombstone: late hooks cannot revive the session, emit side effects, or advance event order; only explicit resume replaces it.",
          "Provider credentials and model traffic remain inside each agent CLI.",
          "External MCP clients and servers remain ordinary terminal processes; ForkTTY does not ship or configure an MCP bridge.",
        ],
      },
    ],
    sources: [{ label: "Agent lifecycle contract", href: `${REPO_DOCS}/docs/agents.md` }],
  },
  {
    id: "hooks",
    eyebrow: "Explicit setup",
    title: "Hooks",
    summary:
      "Hook installation is optional, manual, dry-run capable, and never refreshed automatically at startup.",
    blocks: [
      {
        kind: "code",
        prompt: true,
        lines: [
          "forktty hooks setup --dry-run",
          "forktty hooks setup codex",
          "forktty hooks setup claude",
          "forktty hooks setup antigravity",
          "forktty hooks setup opencode",
        ],
      },
      {
        kind: "paragraph",
        text: "Setup changes only ForkTTY-managed hook entries and preserves unrelated user configuration. Claude installs 25 lifecycle events by default or 28 with --full; Codex installs 10, Antigravity 3, and OpenCode 11. Re-run setup explicitly after an update when doctor reports stale managed hooks.",
      },
      {
        kind: "paragraph",
        text: "Hook doctor remains local and read-only. Its version-1 installationCheck regenerates the canonical managed plan and makes overall health fail for malformed, partial, modified, missing, or non-executable assets, including incomplete Antigravity wrapper sets.",
      },
      {
        kind: "paragraph",
        text: "Claude SessionStart enrichment requires workspace, surface, and absolute socket provenance together; partial provenance performs no socket I/O. Permission, elicitation, and recognized attention hooks carry a provider/session prompt identity. Accepted results retain only the matching in-app notification as read history and close its desktop notification; stale retries are inert, while session cleanup or target removal retires only affected prompts.",
      },
    ],
    sources: [{ label: "Hook details", href: `${REPO_DOCS}/hooks/README.md` }],
  },
  {
    id: "socket-cli-api",
    eyebrow: "Local automation",
    title: "Socket CLI and API",
    summary:
      "The owner-only Unix socket exposes a deliberately small JSON-RPC-like API for terminal workspace primitives.",
    blocks: [
      {
        kind: "code",
        prompt: true,
        lines: [
          "forktty capabilities",
          "forktty identify --json",
          "forktty context-snapshot --tail-lines 0 --json",
          "forktty workspaces",
          "forktty surfaces",
          "forktty tree",
          "forktty read-screen",
          "forktty capture-tail",
          "forktty notifications",
        ],
      },
      {
        kind: "list",
        items: [
          "Workspace and surface methods cover list, create, focus, split, close, text input, bounded visible text, and tail capture.",
          "Notification and metadata methods publish generic attention, progress, status, logs, and statusline output.",
          "notification.list returns one oldest-to-newest page: limit defaults to 200 and accepts 1–200, optional before_id is an exclusive retained-item cursor, and the CLI never aggregates pages automatically.",
          "Context snapshots include the newest 100 selected-workspace and global notifications, omit terminal_metadata.icon_data, and evaluate unread prompt risk across the full matching set.",
          "Normal response lines are capped at 64 MiB including the terminating newline; an oversized result becomes response_too_large with the original request id.",
          "Worktree and project-action methods validate repositories and argv-based commands against visible local state.",
          "Six agent lifecycle methods cover listing, health, reclaim planning, hibernate, reclaim, and resume.",
          "Router, task strategy, team, workflow, feed, approval orchestration, MCP, and managed-skill methods are not part of the API.",
          "Existing MCP registrations and managed skills are not removed automatically; the README migration guide documents ownership-marker checks and safe cleanup.",
        ],
      },
      {
        kind: "paragraph",
        text: "Set FORKTTY_SOCKET_PATH to an absolute path when the default runtime socket is unsuitable. Requests are newline-delimited, size-bounded, and accepted only through an owner-controlled Unix socket.",
      },
      {
        kind: "paragraph",
        text: "Official clients and startup collision checks share a deadline-bounded nonblocking AF_UNIX connector. A full Linux accept backlog retries with a fresh descriptor until the deadline; timeout means occupied/foreign, so the existing socket inode is never removed or replaced.",
      },
      {
        kind: "paragraph",
        text: "Cooperative GTK shutdown first stops new socket dispatch while the UI remains alive, then drains admitted requests and waits for the socket runtime to drop. Only afterward finalization snapshots bounded terminal scrollback, synchronizes live working directories, saves the session, cleans up configured PTY persistence, and closes the window.",
      },
    ],
    sources: [
      { label: "Socket reference", href: `${REPO_DOCS}/docs/socket-api.md` },
      { label: "Runtime spec", href: `${REPO_DOCS}/SPEC.md#socket-api` },
    ],
  },
  {
    id: "git-worktrees",
    eyebrow: "Isolation",
    title: "Git worktrees",
    summary:
      "Represent each editing branch as a visible workspace when parallel processes need separate checkouts.",
    blocks: [
      {
        kind: "code",
        prompt: true,
        lines: [
          "forktty worktree-list --cwd /path/to/repo",
          "forktty worktree-create feature/my-task --cwd /path/to/repo",
          "forktty worktree-status --cwd /path/to/repo",
          "forktty worktree-attach feature/my-task --cwd /path/to/repo",
        ],
      },
      {
        kind: "paragraph",
        text: "Worktree mutations are limited to repositories already represented by a ForkTTY workspace or surface cwd. Dirty-state checks protect uncommitted work during merge and removal flows.",
      },
      {
        kind: "paragraph",
        text: "For the exact worktree-name/canonical-path identity, Create and Attach retries reuse the same existing modeled workspace ID and allocate no new modeled surface; same-named worktrees at different canonical paths stay separate. GTK and socket mutations serialize inside the running ForkTTY process, not through a cross-process Git lock. Remove suppresses automatic terminal respawn while the exact target is quiesced, then either commits the model change or attempts to restore the prior runtime/model state before suppression ends. Terminal respawn during rollback can fail; ForkTTY then records a blocking terminal error status before suppression ends.",
      },
    ],
  },
  {
    id: "configuration-local-files",
    eyebrow: "Local state",
    title: "Configuration and local files",
    summary: "Configuration, sessions, sockets, logs, and optional hook metadata remain local.",
    blocks: [
      {
        kind: "table",
        columns: ["Purpose", "Default path"],
        rows: [
          ["Configuration", "~/.config/forktty/config.toml"],
          ["Session layout", "~/.local/state/forktty/session-v2.json"],
          ["Runtime socket", "$XDG_RUNTIME_DIR/forktty.sock"],
          ["Logs", "$XDG_STATE_HOME/forktty/logs or ~/.local/state/forktty/logs"],
        ],
      },
      {
        kind: "code",
        lines: [
          "[general]",
          "restore_session = true",
          "persist_terminal_processes = false",
          "",
          "[terminal]",
          "persistent_scrollback_lines = 0",
        ],
      },
    ],
  },
  {
    id: "privacy-telemetry",
    eyebrow: "Local-first",
    title: "Privacy and telemetry",
    summary:
      "Terminal contents, project paths, socket payloads, and agent metadata are not sent to ForkTTY infrastructure.",
    blocks: [
      {
        kind: "paragraph",
        text: "The default anonymous daily usage ping contains only coarse app and platform information and can be disabled. A separate optional update check queries GitHub releases. Neither includes terminal text, repository content, usernames, hostnames, or install identifiers.",
      },
      {
        kind: "code",
        lines: [
          "[telemetry]",
          "anonymous_ping = true",
          "endpoint = \"https://forktty.dev/api/telemetry/ping\"",
        ],
      },
    ],
    sources: [{ label: "Privacy policy", href: `${REPO_DOCS}/PRIVACY.md` }],
  },
  {
    id: "security-model",
    eyebrow: "Boundaries",
    title: "Security model",
    summary:
      "ForkTTY assumes same-user local control while defending the socket, filesystem paths, and command boundaries.",
    blocks: [
      {
        kind: "list",
        items: [
          "The Unix socket and its parent must be owned by the current user and use restrictive permissions; each accepted connection is additionally verified against same-user (or root) SO_PEERCRED credentials.",
          "Request lines and terminal reads are bounded; terminal output is untrusted input.",
          "Project actions use validated argv arrays, never sh -c.",
          "Worktree operations are restricted to repositories represented by visible ForkTTY state.",
          "Hook setup preserves unrelated configuration and supports dry-run inspection.",
        ],
      },
    ],
    sources: [{ label: "Security policy", href: `${REPO_DOCS}/SECURITY.md` }],
  },
  {
    id: "troubleshooting",
    eyebrow: "Diagnostics",
    title: "Troubleshooting",
    summary: "Start with doctor, then narrow the problem to packaging, rendering, socket state, or hooks.",
    blocks: [
      {
        kind: "code",
        prompt: true,
        lines: ["forktty doctor", "forktty --json doctor", "forktty capabilities"],
      },
      {
        kind: "list",
        items: [
          "If socket commands cannot connect, launch ForkTTY first or set an absolute FORKTTY_SOCKET_PATH.",
          "If configuration or session files are corrupt, ForkTTY quarantines the bad file and starts from safe defaults.",
          "For hook problems, inspect a dry run and the exact provider config file before applying setup again.",
          "For bug reports, include distro, desktop environment, install method, reproduction steps, and relevant doctor output.",
        ],
      },
    ],
  },
  {
    id: "changelog-highlights",
    eyebrow: "Product direction",
    title: "Changelog highlights",
    summary:
      "The next alpha simplifies ForkTTY around its strongest terminal workspace capabilities.",
    blocks: [
      {
        kind: "list",
        items: [
          "Removed the task router, provider selection, team and workflow state, approval orchestration, right rail, bottom feed, and Team sidebar section.",
          "Removed the built-in MCP bridge, managed MCP registration, managed skill installer, and automatic hook refresh.",
          "Kept Ghostty rendering, workspaces, tabs, splits, worktrees, notifications, command palette, layout restore, generic socket methods, and optional manual hooks.",
        ],
      },
    ],
    sources: [{ label: "Full changelog", href: `${REPO_DOCS}/CHANGELOG.md` }],
  },
  {
    id: "roadmap-limitations-support",
    eyebrow: "What next",
    title: "Roadmap, limitations, and support",
    summary: "ForkTTY remains alpha, Linux-only, and intentionally focused on terminal workspace depth.",
    blocks: [
      {
        kind: "list",
        items: [
          "Known limits include Linux-only support, compositor-dependent quake behavior, optional dtach for process persistence, and source-only browser panes.",
          "Built-in routing, teams, workflows, feed, approval orchestration, MCP, and managed agent skills are explicit non-goals for the terminal core.",
          "Use GitHub Issues for bugs, Discussions for questions, and private reporting for security issues.",
        ],
      },
    ],
    sources: [
      { label: "Roadmap", href: `${REPO_DOCS}/ROADMAP.md` },
      { label: "Support", href: `${REPO_DOCS}/SUPPORT.md` },
    ],
  },
];

export const metadata: Metadata = {
  title: "Docs",
  description:
    "ForkTTY docs for installation, terminal workspaces, optional agent hooks, local socket automation, worktrees, privacy, security, and troubleshooting.",
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "Docs - ForkTTY",
    description:
      "Install and use ForkTTY as a focused Linux GTK/Ghostty terminal workspace for coding agents.",
    url: `${SITE_URL}/docs`,
    siteName: "ForkTTY",
    type: "article",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "ForkTTY docs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Docs - ForkTTY",
    description: "Install, operate, automate, troubleshoot, and audit ForkTTY.",
    images: ["/og.png"],
  },
};

export default function DocsPage() {
  return (
    <>
      <div className="backdrop" aria-hidden>
        <span className="bloom" />
        <span className="grain" />
      </div>

      <Header />
      <main id="main">
        <section className="section py-16 sm:py-20">
          <div className="max-w-4xl">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-forktty">
              Documentation
            </div>
            <h1 className="mt-5 font-display text-[2.7rem] font-semibold leading-[0.98] text-ink-100 sm:text-[4.4rem]">
              ForkTTY wiki.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-300 sm:text-lg">
              Install ForkTTY, organize terminal workspaces, configure optional
              hooks, use the local socket, manage git worktrees, and understand
              the privacy and security boundaries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#download" className="btn-primary">
                Download first
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={REPO_HTML_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-secondary"
              >
                <GitHubIcon className="h-4 w-4" />
                Source repository
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-ink-800/60">
          <div className="section grid gap-10 py-12 sm:py-16 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
            <aside className="lg:sticky lg:top-20">
              <nav aria-label="Documentation sections" className="tui-frame p-4">
                <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-500">
                  On this page
                </div>
                <ol className="space-y-1">
                  {DOC_SECTIONS.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block border-l border-ink-800 px-3 py-1.5 text-sm leading-snug text-ink-300 transition-colors hover:border-forktty hover:text-forktty"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className="min-w-0 space-y-10">
              {DOC_SECTIONS.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 border-t border-ink-800/70 pt-10 first:border-t-0 first:pt-0"
                >
                  <div className="max-w-3xl">
                    <div className="font-mono text-xs uppercase tracking-[0.16em] text-forktty">
                      {section.eyebrow}
                    </div>
                    <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink-100 sm:text-4xl">
                      {section.title}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-ink-300">
                      {section.summary}
                    </p>
                  </div>

                  <div className="mt-7 max-w-4xl space-y-5">
                    {section.blocks.map((block, index) => {
                      if (block.kind === "paragraph") {
                        return (
                          <p key={index} className="text-[15px] leading-7 text-ink-300">
                            {block.text}
                          </p>
                        );
                      }

                      if (block.kind === "list") {
                        return (
                          <ul key={index} className="space-y-2 text-[15px] leading-7 text-ink-300">
                            {block.items.map((item) => (
                              <li key={item} className="flex gap-3">
                                <span className="mt-[0.7rem] h-1 w-1 shrink-0 rounded-full bg-forktty" aria-hidden />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      if (block.kind === "code") {
                        return (
                          <pre key={index} className="overflow-x-auto rounded-lg border border-ink-800 bg-ink-950/80 p-4 text-sm leading-7 text-ink-200">
                            <code>
                              {block.lines.map((line) => `${block.prompt && line ? "$ " : ""}${line}\n`).join("")}
                            </code>
                          </pre>
                        );
                      }

                      return (
                        <div key={index} className="overflow-x-auto rounded-lg border border-ink-800">
                          <table className="min-w-full divide-y divide-ink-800 text-left text-sm">
                            <thead className="bg-ink-900/80 text-ink-200">
                              <tr>
                                {block.columns.map((column) => (
                                  <th key={column} className="px-4 py-3 font-medium">{column}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-ink-800 bg-ink-950/40 text-ink-300">
                              {block.rows.map((row) => (
                                <tr key={row.join(":")}>
                                  {row.map((cell) => (
                                    <td key={cell} className="px-4 py-3 align-top">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>

                  {section.sources && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {section.sources.map((source) => (
                        <a
                          key={source.href}
                          href={source.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-mono text-xs text-ink-400 underline decoration-ink-700 underline-offset-4 transition-colors hover:text-forktty"
                        >
                          {source.label}
                        </a>
                      ))}
                    </div>
                  )}
                </section>
              ))}

              <section className="border-t border-ink-800/70 pt-10">
                <h2 className="font-display text-3xl font-semibold text-ink-100">Source documents</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {SOURCE_LINKS.map((source) => (
                    <a
                      key={source.href}
                      href={source.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center justify-between gap-4 rounded-lg border border-ink-800 bg-ink-900/45 px-4 py-3 text-sm text-ink-200 transition-colors hover:border-ink-700 hover:text-forktty"
                    >
                      {source.label}
                      <ArrowRight className="h-3.5 w-3.5 text-ink-600 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  ))}
                </div>
              </section>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

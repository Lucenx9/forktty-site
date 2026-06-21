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
  | {
      kind: "table";
      columns: [string, string];
      rows: Array<[string, string]>;
    };

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
      "ForkTTY is a Linux-native GTK/Ghostty terminal for coordinating coding agents in tiled workspaces.",
    blocks: [
      {
        kind: "paragraph",
        text: "ForkTTY is built for running Codex, Claude Code, Pi, Antigravity, OpenCode, and plain shell tools side by side without losing track of sessions, panes, or repo state. The app is written in Rust and uses GTK4/libadwaita with an embedded Ghostty terminal renderer.",
      },
      {
        kind: "list",
        items: [
          "Use tiled workspaces and split panes for parallel agent work.",
          "Back tasks with git worktrees so each branch has an isolated workspace.",
          "Drive the app through the same local socket surface used by the CLI and MCP bridge.",
          "Keep project contents, terminal text, and agent metadata local by default.",
        ],
      },
      {
        kind: "paragraph",
        text: "The current alpha is Linux-only. The packaged runtime is focused on GTK/Ghostty terminal panes; source-only browser panes remain behind the optional browser feature for intentional testing.",
      },
    ],
    sources: [
      { label: "README overview", href: `${REPO_DOCS}/README.md#why-forktty` },
      { label: "Native runtime", href: `${REPO_DOCS}/docs/native-gtk-ghostty.md` },
    ],
  },
  {
    id: "install-first-run",
    eyebrow: "Quick start",
    title: "Install and first run",
    summary:
      "Use the AppImage for the portable alpha path, or the .deb package on modern Debian and Ubuntu baselines.",
    blocks: [
      {
        kind: "table",
        columns: ["Path", "Use it when"],
        rows: [
          [
            "AppImage",
            "Recommended portable Linux x86_64 build. Verify SHA256SUMS, mark executable, and launch directly.",
          ],
          [
            ".deb",
            "Debian 13/Trixie+ and Ubuntu 24.04 LTS+ package path. Debian 12 is below the documented baseline.",
          ],
          [
            "Source build",
            "Use when developing ForkTTY or testing source-only browser panes. Requires Rust 1.96+, GTK4/libadwaita dev files, git, Zig, and the Ghostty submodule.",
          ],
        ],
      },
      {
        kind: "code",
        lines: [
          "sha256sum -c SHA256SUMS --ignore-missing",
          "chmod +x forktty-*.AppImage",
          "./forktty-*.AppImage",
        ],
      },
      {
        kind: "code",
        lines: ["forktty --version", "forktty doctor"],
      },
      {
        kind: "paragraph",
        text: "forktty doctor is local-only and reports config, session, socket, and hook config diagnostics. Use forktty --json doctor for socket, environment, executable, hook config, MCP config, and agent skill paths.",
      },
      {
        kind: "paragraph",
        text: "If a GTK renderer issue appears on a specific distro or driver stack, ForkTTY defaults to the GL renderer through GSK_RENDERER=ngl and still honors an explicit GSK_RENDERER override for QA and debugging.",
      },
    ],
    sources: [
      { label: "Install docs", href: `${REPO_DOCS}/README.md#install` },
      { label: "Release assets", href: RELEASES_HTML_URL },
    ],
  },
  {
    id: "daily-use",
    eyebrow: "Operate",
    title: "Daily use",
    summary:
      "ForkTTY keeps terminal work dense: workspaces, tabs, split panes, search, settings, notifications, and quake mode are all native GTK surfaces.",
    blocks: [
      {
        kind: "list",
        items: [
          "Open the command palette with Ctrl+Shift+P for actions such as new workspace, split, settings, notifications, and shortcuts.",
          "Use split panes and tabs to keep multiple agents visible without mixing their scrollback.",
          "Session restore writes native state to ~/.local/state/forktty/session-v2.json, but live PTYs themselves are not persisted.",
          "Prompt-aware notifications can come from socket calls, hooks, Ghostty OSC events, bell/child-exit events, or bounded prompt fallback detection.",
          "Quake/dropdown behavior uses gtk4-layer-shell where the compositor supports it and falls back to normal GTK behavior elsewhere.",
        ],
      },
      {
        kind: "paragraph",
        text: "The app follows a compact native design: quiet chrome, dense status rows, native dialogs, and terminal-owned theme behavior instead of marketing-style panels inside the product UI.",
      },
    ],
    sources: [
      { label: "Runtime notes", href: `${REPO_DOCS}/docs/native-gtk-ghostty.md#runtime-notes` },
      { label: "Visual rules", href: `${REPO_DOCS}/docs/DESIGN.md` },
    ],
  },
  {
    id: "agent-integrations",
    eyebrow: "Agents",
    title: "Agent integrations",
    summary:
      "The Agent HUD is powered by hooks and socket metadata so running agents can be focused, resumed, and inspected.",
    blocks: [
      {
        kind: "paragraph",
        text: "ForkTTY targets Codex, Claude Code, Pi, Antigravity, OpenCode, and shell agents. Managed hooks for Codex, Claude Code, Antigravity, and OpenCode persist session ids, cwd, lifecycle state, last activity, permission prompts, token details where available, and status entries consumed by the Agent HUD; agent rows add source/age metadata for freshness checks, and provider-scoped HUD metadata is cleared when the last matching session ends, closes, hibernates, or is forgotten. Claude Code team workers launched without explicit permission args use documented permission-mode defaults; Pi review workers default to read-only tools unless explicit Pi tool args are supplied. Managed skills add the policy layer that tells agents when to inspect ForkTTY context, teams, workflows, and terminal state.",
      },
      {
        kind: "list",
        items: [
          "Use forktty agents to list known agent sessions.",
          "Use forktty agent-health to inspect stale or resumable sessions.",
          "Use forktty resume-agent when a provider supports reopening a saved session.",
          "Use forktty set-status, set-progress, log, notify, and notifications for custom tools that publish agent state without a managed hook.",
        ],
      },
      {
        kind: "paragraph",
        text: "Provider keys and remote agent traffic stay outside ForkTTY. Bring your own agent CLI and credentials; ForkTTY coordinates local panes, metadata, hooks, socket calls, and notifications.",
      },
    ],
    sources: [
      { label: "Agent hooks", href: `${REPO_DOCS}/hooks/README.md` },
      { label: "Socket spec", href: `${REPO_DOCS}/SPEC.md#socket-api` },
    ],
  },
  {
    id: "hooks",
    eyebrow: "Automation",
    title: "Hooks",
    summary:
      "Hooks install provider-specific config entries that report session lifecycle and status back to ForkTTY.",
    blocks: [
      {
        kind: "code",
        lines: [
          "forktty hooks setup",
          "forktty hooks setup --dry-run",
          "forktty hooks setup codex",
          "forktty hooks doctor",
          "forktty hooks test",
          "forktty hooks remove codex",
          "forktty hooks remove gemini   # legacy cleanup only",
        ],
      },
      {
        kind: "table",
        columns: ["Provider", "Managed destination"],
        rows: [
          ["Codex", "$CODEX_HOME/hooks.json or ~/.codex/hooks.json"],
          ["Claude Code", "$CLAUDE_CONFIG_DIR/settings.json or ~/.claude/settings.json"],
          ["Antigravity", "~/.gemini/config/hooks.json plus generated wrappers"],
          ["OpenCode", "$OPENCODE_CONFIG_DIR/plugins/forktty.generated.js or ~/.config/opencode/plugins/forktty.generated.js"],
        ],
      },
      {
        kind: "paragraph",
        text: "Setup is explicit on first install. Once ForkTTY-managed entries exist, newer builds can refresh managed hook, MCP, and skill entries while preserving unrelated user configuration. Gemini setup is removed; remove commands only keep a legacy cleanup path for old ForkTTY-managed ~/.gemini/settings.json entries.",
      },
    ],
    sources: [{ label: "Hooks README", href: `${REPO_DOCS}/hooks/README.md` }],
  },
  {
    id: "mcp-setup",
    eyebrow: "MCP",
    title: "MCP setup",
    summary:
      "The MCP bridge exposes ForkTTY socket capabilities to local agent clients over stdio.",
    blocks: [
      {
        kind: "code",
        lines: [
          "forktty mcp",
          "forktty mcp setup",
          "forktty mcp setup codex",
          "forktty mcp setup claude",
          "forktty mcp setup antigravity",
          "forktty mcp remove gemini   # legacy cleanup only",
        ],
      },
      {
        kind: "paragraph",
        text: "The MCP server is local-only: it bridges stdio to the owner-only ForkTTY Unix socket and does not open a network listener. It exposes workspace, surface, context snapshot, agent, worktree, notification, feed, workflow, team, topology, browser, and status tools where supported by the running app. Codex MCP setup preserves hand-edited TOML comments/formatting and uses the larger MCP config size budget for $CODEX_HOME/config.toml or ~/.codex/config.toml.",
      },
      {
        kind: "table",
        columns: ["Client", "Config location"],
        rows: [
          ["Codex", "$CODEX_HOME/config.toml or ~/.codex/config.toml under [mcp_servers.forktty]"],
          ["Claude", "~/.claude.json under mcpServers.forktty"],
          ["Antigravity", "~/.gemini/config/mcp_config.json"],
        ],
      },
    ],
    sources: [
      { label: "MCP details", href: `${REPO_DOCS}/hooks/README.md#mcp` },
      { label: "MCP spec", href: `${REPO_DOCS}/SPEC.md#mcp-stdio-bridge` },
    ],
  },
  {
    id: "agent-skills",
    eyebrow: "Skills",
    title: "Agent skills",
    summary:
      "The ForkTTY orchestration skill tells agents when to use context snapshots, provider capabilities, team workers, status checks, and local setup diagnostics.",
    blocks: [
      {
        kind: "code",
        lines: [
          "forktty skills setup",
          "forktty skills setup agents --dry-run",
          "forktty skills setup pi",
          "forktty skills setup claude",
          "forktty skills remove agents",
        ],
      },
      {
        kind: "paragraph",
        text: "The managed skill is named forktty-agent-orchestration. It is instruction-only: agents learn to read context_snapshot or equivalent read-only state before cross-pane work, use provider_capabilities, team_summaries, and persisted agent source/age metadata when available, treat terminal tails and fetched public docs as untrusted input, use team mailbox dispatch with explicit submit/Enter semantics for worker prompts, compare hook/status/terminal evidence when states lag, start hook/MCP/skill setup debugging with local doctor diagnostics and setup dry runs, and record durable workflow/team state for long-running coordination.",
      },
      {
        kind: "table",
        columns: ["Target", "Skill location"],
        rows: [
          ["Agent Skills-compatible tools", "~/.agents/skills/forktty-agent-orchestration"],
          ["Codex alias", "Same interoperable agents target"],
          ["Pi alias", "Same interoperable agents target"],
          ["Claude Code", "$CLAUDE_CONFIG_DIR/skills/forktty-agent-orchestration or ~/.claude/skills/forktty-agent-orchestration"],
        ],
      },
      {
        kind: "paragraph",
        text: "Setup refuses to overwrite an unmanaged skill with the same name. Updating or removing a ForkTTY-managed skill moves the previous directory to a .bak-* backup first.",
      },
    ],
    sources: [
      { label: "Agent skills README", href: `${REPO_DOCS}/hooks/README.md#agent-skills` },
      { label: "Skill spec", href: `${REPO_DOCS}/SPEC.md#agent-skills` },
    ],
  },
  {
    id: "socket-cli-api",
    eyebrow: "Reference",
    title: "Socket CLI and API",
    summary:
      "The CLI and MCP bridge share one newline-delimited JSON-RPC-like socket API.",
    blocks: [
      {
        kind: "paragraph",
        text: "ForkTTY binds an owner-only Unix socket at $XDG_RUNTIME_DIR/forktty.sock, with fallback /tmp/forktty-<uid>/forktty.sock. Set FORKTTY_SOCKET_PATH=/absolute/path to override it for both the app and CLI.",
      },
      {
        kind: "code",
        lines: [
          "forktty ping",
          "forktty list",
          "forktty surfaces",
          "forktty status explain --tail-lines 20",
          "forktty status watch --count 3 --interval-ms 2000",
          "forktty context-snapshot --workspace-name main --tail-lines 0 --json",
          "forktty team ask review-team claude-review --agent claude --task-id review-head --prompt \"Review HEAD read-only\" --submit",
          "forktty team review review-team claude-review --agent claude --task-id review-head --commit HEAD --submit",
          "forktty team watch review-team --stale-after-ms 120000 --limit 10",
          "forktty team finish review-team",
          "forktty read-screen",
          "forktty capture-tail",
          "forktty split-surface --axis vertical",
          "forktty send-text \"echo hello\"",
          "forktty capabilities",
          "forktty events",
          "forktty examples",
          "forktty completions bash",
        ],
      },
      {
        kind: "paragraph",
        text: "High-level CLI wrappers compose existing socket methods for common agent coordination flows. team ask and team review create or update the team, create the task before launching a fresh worker surface, assign it after launch, queue the prompt, and dispatch it with an explicit terminal Enter when submit mode is requested; the worker is bound to the invoking ForkTTY pane or workspace when available, and MCP team_upsert uses the same pane defaults. Low-level team_worker_launch with worktree_name opens the worker in that already-open worktree workspace and inherits that cwd. Re-run the wrappers to launch a new worker, or use team-message-send plus team-message-dispatch for follow-up prompts to an existing worker. Dispatch selects the worker workspace/tab and waits briefly for the embedded terminal surface to become socket-ready before typing. Context snapshots include compact team_summaries for leader monitoring.",
      },
      {
        kind: "list",
        items: [
          "System methods cover ping, capabilities, provider capability discovery, and event subscriptions.",
          "Workspace and surface methods cover list, focus, split, close, text input, visible text, and tail capture.",
          "Agent methods cover agent listing, health, source/age metadata, resume, and reclaim planning.",
          "Metadata methods publish status, progress, logs, and statusline output.",
          "Status helpers explain context snapshots, watch delayed state, and expose the context-snapshot alias used by CLI and MCP automation with per-surface plus aggregate-bounded terminal tails.",
          "Generated bash, zsh, and fish completions cover the curated ergonomic command set and grouped team/status subcommands.",
          "Worktree methods validate target paths against repos already opened by the user.",
          "Error codes include method_not_found, missing_param, not_found, payload_too_large, conflict, precondition_failed, already_exists, not_ready, invalid_param, and error.",
        ],
      },
    ],
    sources: [
      { label: "Socket API", href: `${REPO_DOCS}/SPEC.md#socket-api` },
      { label: "CLI examples", href: `${REPO_DOCS}/README.md#socket-cli` },
    ],
  },
  {
    id: "git-worktrees",
    eyebrow: "Repos",
    title: "Git worktrees",
    summary:
      "Worktrees are first-class ForkTTY workspaces for isolated parallel tasks.",
    blocks: [
      {
        kind: "code",
        lines: [
          "forktty worktree-status",
          "forktty worktree-list",
          "forktty worktree-create feature/my-task --cwd /path/to/repo",
          "forktty worktree-attach feature/my-task --cwd /path/to/repo",
        ],
      },
      {
        kind: "paragraph",
        text: "ForkTTY uses native git operations to create, attach, remove, and merge worktrees. Socket worktree calls require an explicit cwd and are constrained to repositories the user has opened, so automation cannot operate on arbitrary repos behind the user's back.",
      },
      {
        kind: "list",
        items: [
          "Default layout can place worktrees under a repo-local .worktrees directory or sibling layout depending on configuration.",
          "Dirty-state protection blocks destructive worktree actions that would drop uncommitted work.",
          "Optional .forktty/setup and teardown hooks let projects prepare or clean a worktree.",
          "Repo-local forktty.json can describe project actions and workflow hints for automation.",
        ],
      },
    ],
    sources: [
      { label: "Worktree behavior", href: `${REPO_DOCS}/SPEC.md#worktree-behavior` },
      { label: "Roadmap", href: `${REPO_DOCS}/ROADMAP.md` },
    ],
  },
  {
    id: "configuration-local-files",
    eyebrow: "Local state",
    title: "Configuration and local files",
    summary:
      "ForkTTY stores bounded config, session, browser profile, and state files under normal XDG locations.",
    blocks: [
      {
        kind: "table",
        columns: ["Path", "Purpose"],
        rows: [
          ["~/.config/forktty/config.toml", "User configuration for ForkTTY-owned behavior."],
          ["~/.local/state/forktty/session-v2.json", "Workspace, pane, and recent scrollback session state."],
          ["~/.local/share/forktty/browser_profiles/profiles.json", "Source-only browser profile index."],
          ["~/.local/share/forktty/browser_profiles/<id>/", "Source-only WebKit profile data."],
        ],
      },
      {
        kind: "paragraph",
        text: "ForkTTY now leaves Ghostty-owned terminal appearance and runtime behavior to Ghostty configuration. Live embedded panes follow Ghostty's scrollback-limit budget, default to 10 MB per surface, and honor scrollbar = system|never. Legacy TOML keys for terminal font, theme, bell, renderer, and scrollback still load for compatibility but are not exposed in newly saved settings.",
      },
      {
        kind: "code",
        prompt: false,
        lines: [
          "[general]",
          'theme_source = "dark"',
          'worktree_layout = "nested"',
          "enable_pr_lookup = false",
          'notification_command = ""',
          "",
          "[appearance]",
          "persistent_scrollback_lines = 0",
          'sidebar_position = "left"',
          "sidebar_visible = true",
          'window_mode = "normal"',
          "",
          "[notifications]",
          "desktop = true",
          "sound = true",
          "",
          "[telemetry]",
          "anonymous_ping = true",
        ],
      },
    ],
    sources: [
      { label: "Configuration", href: `${REPO_DOCS}/README.md#configuration` },
      { label: "Runtime spec", href: `${REPO_DOCS}/SPEC.md#config` },
    ],
  },
  {
    id: "privacy-telemetry",
    eyebrow: "Privacy",
    title: "Privacy and telemetry",
    summary:
      "ForkTTY is local-first and limits network activity to update checks and an anonymous daily ping that can be disabled.",
    blocks: [
      {
        kind: "paragraph",
        text: "The app does not send crash reports, terminal contents, project paths, socket payloads, agent metadata, usernames, hostnames, or install identifiers to ForkTTY infrastructure.",
      },
      {
        kind: "list",
        items: [
          "Anonymous app telemetry is a daily ping to https://forktty.dev/api/telemetry/ping when enabled.",
          "The ping payload contains only schema, kind, app, version, and date.",
          "GitHub update checks are once-a-day release metadata checks when enabled.",
          "Desktop notifications are local OS notifications, except for whatever your desktop environment needs to display them.",
          "Disable app telemetry from the first-launch privacy prompt or config.",
        ],
      },
    ],
    sources: [
      { label: "App privacy", href: `${REPO_DOCS}/PRIVACY.md` },
      { label: "Site privacy", href: "/privacy" },
    ],
  },
  {
    id: "security-model",
    eyebrow: "Security",
    title: "Security model",
    summary:
      "ForkTTY assumes a local same-user trust boundary and defends the socket, config, session, and package runtime accordingly.",
    blocks: [
      {
        kind: "list",
        items: [
          "The Unix socket is owner-only and local to the user's desktop session.",
          "Socket payloads and list limits are bounded to avoid unbounded memory requests.",
          "Notification commands are executed as argv, not through shell pipelines.",
          "Config and session recovery quarantine malformed, oversized, or invalid state instead of repeatedly loading it.",
          "Embedded Ghostty library loading canonicalizes candidate paths and rejects relative, non-regular, untrusted, or writable-by-others paths.",
          "Security reports should use GitHub private vulnerability reporting.",
        ],
      },
      {
        kind: "paragraph",
        text: "Supported security updates track the current 0.2.0-alpha.x line. Older 0.1.x releases are not covered by the current supported-version policy.",
      },
    ],
    sources: [{ label: "Security policy", href: `${REPO_DOCS}/SECURITY.md` }],
  },
  {
    id: "troubleshooting",
    eyebrow: "Fixes",
    title: "Troubleshooting",
    summary:
      "Start with doctor output, package baseline checks, renderer overrides, and the socket path.",
    blocks: [
      {
        kind: "code",
        lines: [
          "forktty doctor",
          "forktty --json doctor",
          "forktty ping",
          "GSK_RENDERER=gl ./forktty-*.AppImage",
          "FORKTTY_SOCKET_PATH=/absolute/path forktty ping",
        ],
      },
      {
        kind: "list",
        items: [
          "If packaged terminal panes fail to start, confirm the release artifact includes ghostty-gtk-embed.so and bundled runtime dependencies.",
          "If .deb install fails on Debian 12/Bookworm, use a supported Debian 13/Trixie+ or Ubuntu 24.04 LTS+ baseline.",
          "If socket commands cannot connect, launch ForkTTY first or set an absolute FORKTTY_SOCKET_PATH.",
          "If config or session files are corrupt, ForkTTY should quarantine the bad file and start from defaults.",
          "For bug reports, include forktty doctor output, distro and desktop environment, install method, reproduction steps, and relevant logs. Include forktty --json doctor when MCP or skill path diagnostics matter.",
        ],
      },
    ],
    sources: [
      { label: "Troubleshooting", href: `${REPO_DOCS}/README.md#troubleshooting` },
      { label: "Support", href: `${REPO_DOCS}/SUPPORT.md` },
      { label: "QA matrix", href: `${REPO_DOCS}/docs/QA.md` },
    ],
  },
  {
    id: "changelog-highlights",
    eyebrow: "Releases",
    title: "Changelog highlights",
    summary:
      "The latest recorded release is 0.2.0-alpha.14 from 2026-06-19.",
    blocks: [
      {
        kind: "list",
        items: [
          "0.2.0-alpha.14 fixed embedded Ghostty renderer memory growth by defaulting GTK compositing to the GL renderer.",
          "Embedded Ghostty redraws now follow the 16ms wakeup-check cadence instead of a 100ms floor during continuous output.",
          "AppImage packaging verifies the embedded Ghostty GTK library dependencies, not only the main binary.",
          "Embedded panes now honor Ghostty scrollback-limit and scrollbar, with a bounded default of 10 MB per surface.",
          "Agent health, explicit resume, and restore-time auto-resume preserve Codex and Claude Code bypass-permissions sessions instead of restarting them in prompted mode.",
          "Security fixes hardened restored session identifiers, command-spawn values, library loading, OSC99 icon sizing, and Kitty image snapshots.",
          "Docs, package metadata, the first-run privacy link, and the telemetry endpoint now use the canonical https://forktty.dev domain.",
        ],
      },
    ],
    sources: [
      { label: "Changelog", href: `${REPO_DOCS}/CHANGELOG.md` },
      { label: "GitHub releases", href: RELEASES_HTML_URL },
    ],
  },
  {
    id: "roadmap-limitations-support",
    eyebrow: "Project status",
    title: "Roadmap, limitations, and support",
    summary:
      "ForkTTY is an early alpha with a Linux-first roadmap and explicit non-goals.",
    blocks: [
      {
        kind: "list",
        items: [
          "Known limitations: Linux-only, libadwaita 1.4+ baseline, AppImage host dependencies, PTYs not persisted, partial OSC notification coverage, compositor-dependent quake behavior, and source-only browser panes.",
          "Near-term roadmap areas include richer Agent HUD/statusline exports, remote daemon depth, sidebar/workspace organization, topology and tmux-like verbs, prompt composer work, agent catalog surfaces, project panels, QA matrix depth, command palette search, branch picker, notification inbox grouping, theme customization, and broader Ghostty options.",
          "Use GitHub Issues for bugs, GitHub Discussions for questions, and private vulnerability reporting for security issues.",
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
    "ForkTTY wiki for installation, daily use, agent hooks, MCP, socket automation, worktrees, privacy, security, troubleshooting, and releases.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Docs - ForkTTY",
    description:
      "Complete ForkTTY wiki for install paths, agent integrations, hooks, MCP, socket CLI and API, worktrees, privacy, security, and troubleshooting.",
    url: `${SITE_URL}/docs`,
    siteName: "ForkTTY",
    type: "article",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ForkTTY docs wiki",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Docs - ForkTTY",
    description:
      "Install, operate, automate, troubleshoot, and audit ForkTTY from one onsite wiki.",
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
              Install ForkTTY, wire up agents, use the local socket and MCP
              bridge, manage git worktrees, and check the privacy and security
              model from one stable onsite reference.
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
              <nav
                aria-label="Documentation sections"
                className="tui-frame p-4"
              >
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

                  <div className="mt-6 max-w-4xl space-y-5">
                    {section.blocks.map((block) => (
                      <DocBlockView block={block} key={blockKey(section.id, block)} />
                    ))}
                  </div>

                  {section.sources ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {section.sources.map((source) => (
                        <a
                          key={source.label}
                          href={source.href}
                          target={source.href.startsWith("/") ? undefined : "_blank"}
                          rel={
                            source.href.startsWith("/")
                              ? undefined
                              : "noreferrer noopener"
                          }
                          className="chip hover:border-forktty/70 hover:text-forktty"
                        >
                          {source.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </section>
              ))}

              <section className="tui-frame p-6">
                <h2 className="font-display text-2xl font-semibold leading-tight text-ink-100">
                  Source references
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-400">
                  This page is maintained from the public ForkTTY repository.
                  Use these files when you need the raw source document behind
                  the onsite wiki.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {SOURCE_LINKS.map((source) => (
                    <a
                      key={source.label}
                      href={source.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center justify-between gap-4 border border-ink-800 bg-ink-900/70 px-4 py-3 text-sm text-ink-200 hover:border-forktty/70 hover:text-forktty"
                    >
                      <span>{source.label}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-forktty" />
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

function DocBlockView({ block }: { block: DocBlock }) {
  if (block.kind === "paragraph") {
    return <p className="text-[15px] leading-relaxed text-ink-300">{block.text}</p>;
  }

  if (block.kind === "list") {
    return (
      <ul className="space-y-2 text-[15px] leading-relaxed text-ink-300">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-forktty" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.kind === "code") {
    return (
      <pre className="overflow-x-auto border border-ink-800 bg-ink-950 p-4 font-mono text-[12.5px] leading-relaxed text-ink-100">
        {block.lines.map((line, index) => (
          <div key={`${line}-${index}`}>
            {line && block.prompt !== false ? (
              <>
                <span className="select-none text-ink-500">$</span> {line}
              </>
            ) : line ? (
              line
            ) : (
              <span aria-hidden>&nbsp;</span>
            )}
          </div>
        ))}
      </pre>
    );
  }

  return (
    <div className="overflow-x-auto border border-ink-800">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead className="bg-ink-900 text-ink-200">
          <tr>
            {block.columns.map((column) => (
              <th
                key={column}
                className="border-b border-ink-800 px-4 py-3 font-mono text-xs uppercase tracking-[0.12em]"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800 text-ink-300">
          {block.rows.map(([left, right]) => (
            <tr key={`${left}-${right}`}>
              <td className="w-[34%] align-top px-4 py-3 font-mono text-xs text-ink-100">
                {left}
              </td>
              <td className="px-4 py-3 leading-relaxed">{right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function blockKey(sectionId: string, block: DocBlock) {
  if (block.kind === "paragraph") {
    return `${sectionId}-paragraph-${block.text.slice(0, 48)}`;
  }
  if (block.kind === "list") {
    return `${sectionId}-list-${block.items[0]}`;
  }
  if (block.kind === "code") {
    return `${sectionId}-code-${block.lines.join("|").slice(0, 48)}`;
  }
  return `${sectionId}-table-${block.columns.join("-")}-${block.rows[0][0]}`;
}

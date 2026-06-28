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
        text: "forktty doctor is local-only and reports config, session, socket, and hook config diagnostics. Use forktty --json doctor for socket, environment, executable, hook config, MCP config, and agent skill paths with managed skill status/checksums/repair commands; managed skill files are inspected through bounded regular-file reads, and symlinked skill directory entries are reported invalid without a repair command unless a regular SKILL.md marker was already verified.",
      },
      {
        kind: "paragraph",
        text: "The AppImage prefers the host GTK/libadwaita stack when available and keeps its bundled GTK copy as a fallback. Set FORKTTY_APPIMAGE_GTK_RUNTIME=bundled, host, or auto to force that choice while debugging renderer issues; ForkTTY also honors explicit GSK_RENDERER overrides.",
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
          "Open the command palette with Ctrl+Shift+P for actions such as new workspace, split, settings, notifications, and shortcuts; Ctrl+? (or F1) opens Keyboard Shortcuts, Ctrl+, opens Settings, and F10 opens the Main Menu when focus is outside terminal content.",
          "Use split panes and tabs to keep multiple agents visible without mixing their scrollback; drag pane headers to swap panes.",
          "Session restore writes native state to ~/.local/state/forktty/session-v2.json. By default live PTYs are not persisted, but Settings > Worktrees can enable general.persist_terminal_processes for plain terminals when dtach is available. Those processes survive a UI restart and re-attach on relaunch; AppImage-launched brokers close inherited runtime file descriptors before dtach starts so surviving brokers do not keep FUSE mounts alive. Explicit pane close or restart terminates the matching managed broker process tree and removes the broker socket so reused surface ids start fresh. Disabling persistence preserves currently visible panes until they close; closing the GTK window with persistence disabled cleans visible managed brokers too, and startup with persistence disabled cleans old managed sessions before restore.",
          "Prompt-aware notifications can come from socket calls, hooks, Ghostty OSC events, bell/child-exit events, or bounded prompt fallback detection.",
          "Quake/dropdown behavior uses gtk4-layer-shell where the compositor supports it and falls back to normal GTK behavior elsewhere.",
        ],
      },
      {
        kind: "paragraph",
        text: "The app follows a compact native design: quiet chrome, dense status rows, native dialogs, and terminal-owned theme behavior instead of marketing-style panels inside the product UI.",
      },
      {
        kind: "paragraph",
        text: "Plain terminal process persistence is optional because it needs a detach broker on PATH. ForkTTY currently uses dtach: install it with the native package manager where available, then enable Settings > Worktrees > Persist terminal processes and check forktty capabilities for PTY broker availability.",
      },
      {
        kind: "table",
        columns: ["Distro family", "dtach install command"],
        rows: [
          ["Debian / Ubuntu / Mint / Pop!_OS", "sudo apt update && sudo apt install dtach; on minimal Ubuntu bases, enable universe first if apt cannot find it."],
          ["Fedora", "sudo dnf install dtach"],
          ["RHEL / CentOS Stream / Rocky / Alma", "Enable the matching EPEL repository first, then sudo dnf install dtach."],
          ["Arch / CachyOS / EndeavourOS / Manjaro", "dtach is not in the official Arch repos; install dtach from AUR or build upstream dtach from source."],
          ["openSUSE Tumbleweed", "sudo zypper install dtach"],
          ["openSUSE Leap", "Use the openSUSE package page/backports if your Leap release does not expose an official dtach package."],
          ["Alpine", "sudo apk add dtach"],
          ["Gentoo", "sudo emerge app-misc/dtach"],
          ["NixOS / Nix", "Add pkgs.dtach to your system or shell environment, then restart ForkTTY so it is on PATH."],
          ["Void Linux", "sudo xbps-install -S dtach if available for your repository; otherwise build upstream dtach from source."],
        ],
      },
      {
        kind: "code",
        prompt: false,
        lines: [
          "# universal source fallback",
          "git clone https://github.com/crigler/dtach.git",
          "cd dtach",
          "./configure",
          "make",
          "sudo make install",
          "forktty capabilities | grep -i pty",
        ],
      },
    ],
    sources: [
      { label: "Runtime notes", href: `${REPO_DOCS}/docs/native-gtk-ghostty.md#runtime-notes` },
      { label: "Visual rules", href: `${REPO_DOCS}/docs/DESIGN.md` },
      { label: "dtach upstream", href: "https://github.com/crigler/dtach" },
      { label: "Debian dtach package", href: "https://packages.debian.org/dtach" },
      { label: "Fedora dtach package", href: "https://packages.fedoraproject.org/pkgs/dtach/dtach" },
      { label: "Arch dtach notes", href: "https://wiki.archlinux.org/title/Dtach" },
      { label: "openSUSE dtach package", href: "https://software.opensuse.org/package/dtach" },
      { label: "Alpine dtach package", href: "https://pkgs.alpinelinux.org/package/edge/main/x86_64/dtach" },
      { label: "Gentoo dtach package", href: "https://packages.gentoo.org/packages/app-misc/dtach" },
    ],
  },
  {
    id: "agent-integrations",
    eyebrow: "Agents",
    title: "Agent integrations",
    summary:
      "The Agent HUD is powered by hooks and socket metadata so running agents can be scanned, focused, resumed, and inspected.",
    blocks: [
      {
        kind: "paragraph",
        text: "ForkTTY targets Codex, Claude Code, Pi, Antigravity, OpenCode, and shell agents. Managed hooks for Codex, Claude Code, Antigravity, and OpenCode persist session ids, cwd, lifecycle state, last activity, permission prompts, token details where available, and status entries consumed by the Agent HUD; agent rows group lifecycle states with scan-friendly labels such as Working, Needs input, Done, and Idle, mark the current pane, surface risky permission modes, show compact workflow loop chips for bound surfaces, add source/age metadata and diagnostic lifecycle_evidence for freshness checks against the workspace/provider status row, and provider-scoped HUD metadata is cleared when the last matching session ends, closes, hibernates, or is forgotten. The sidebar uses a tracked agent resume_cwd as the visible project path when it differs from the workspace launch directory. Team worker launch can omit --agent or use auto; Settings > Agents controls the default provider, fallback, provider order, disabled providers, PATH detection, and direct command overrides for non-default harness install locations, while forktty capabilities reports the active policy, resolved harnesses, and PTY persistence broker availability. Claude Code team workers launched without explicit permission args use documented permission-mode defaults; Pi review workers default to read-only tools unless explicit Pi tool args are supplied. Managed skills add the policy layer that tells agents when to inspect ForkTTY context, teams, workflows, and terminal state.",
      },
      {
        kind: "list",
        items: [
          "Use forktty agents to list known agent sessions.",
          "Use forktty agent-health to inspect stale or resumable sessions.",
          "Use forktty resume-agent when a provider supports reopening a saved session.",
          "Use forktty set-status, set-progress, log, notify, and notifications for custom tools that publish agent state without a managed hook.",
          "Prompt notifications keep approval state as pending, approved, denied, dismissed, or stale; dismiss/clear syncs in-app state with desktop notifications and OSC 99 close reports, and the latest-target action prioritizes unread prompts before lower-urgency history.",
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
          "forktty hooks doctor codex",
          "forktty hooks test codex",
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
        text: "Setup is explicit on first install. Once ForkTTY-managed entries exist, newer builds can refresh managed hook, MCP, and skill entries while preserving unrelated user configuration. When setup records an AppImage launcher for hook CLI calls, ForkTTY sets APPIMAGE_EXTRACT_AND_RUN=1 for those generated commands so short hooks do not keep FUSE AppImage mounts alive. Antigravity lifecycle hooks such as PreInvocation use flat handler entries; its tool hooks use the nested matcher/hooks shape. Gemini setup is removed; remove commands only keep a legacy cleanup path for old ForkTTY-managed ~/.gemini/settings.json entries.",
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
        text: "The MCP server is local-only: it bridges stdio to the owner-only ForkTTY Unix socket and does not open a network listener. It exposes identify, workspace, surface, context snapshot, task strategy planning, agent, worktree, notification, feed, workflow, team, topology, browser, and status tools where supported by the running app. identify treats ForkTTY pane workspace/surface env ids as caller context instead of mandatory targets. Codex MCP setup preserves hand-edited TOML comments/formatting and uses the larger MCP config size budget for $CODEX_HOME/config.toml or ~/.codex/config.toml. If setup registers an AppImage launcher, the managed MCP server env includes APPIMAGE_EXTRACT_AND_RUN=1 so persistent MCP clients do not keep a FUSE AppImage mount alive.",
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
      "The ForkTTY orchestration skill tells agents when to use context snapshots, provider capabilities, team workers, status checks, worktree boundaries, and local setup diagnostics.",
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
        text: "The managed skill is named forktty-agent-orchestration. It is instruction-only: agents learn to call task_strategy_plan before choosing team, workflow loop, worktree, or multi-harness execution for non-trivial tasks; task planning returns a selected router profile, ranked candidate strategy scores plus role-specific harness assignment scores with factor breakdowns, uses capabilities, provider policy as the harness assignment tie-break, explicit cwd or selected surface/workspace cwd dirty inference, goal-based likely edit-intent inference, profile inference for clear fast/conservative/parallel/review-heavy goals, inferred/advisory last-known-good strategy/harness stickiness from completed workflow history or explicit caller evidence, and optional per-harness cooldown/lockout signals from concrete runtime evidence; use task_strategy_apply only after explicit approvals to stage visible workflow/team/task/message state by default, recompute dirty-repo edit isolation, worktree approvals, and multi-worker submit approvals from the selected target, requested operation, and effective plan shape, treat approved as caller attestation, request human approval through the Feed without starting work, then retry the same request with the approved returned approval_id or an equivalent explicit approved attestation that dismisses the superseded pending approval, or submit supported team plans as visible worker panes; any worktree-layer apply requires worktree_name for an already-open ForkTTY worktree workspace; use identify for cheap canonical caller/target context; read context_snapshot or equivalent read-only state before broader cross-pane work; use bounded forktty wait agent-status for lifecycle waits instead of hand-rolled polling when the CLI is available; use provider capability metadata, compact workflow_summaries, loop_summaries, team_summaries, effective_project_cwd, compact feed defaults with include_feed_trace only for trace debugging, and persisted agent source/age/lifecycle_evidence metadata when available; opt into full workflow or team details only when needed; inspect team/workflow consistency warnings and loop risk flags before treating work as finished; run a durable team preflight with workflow_upsert, workflow_plan_set, workflow_loop_set, and team_task_upsert before non-trivial worker launches; use explicit worker role contracts; keep mutating parallel workers in separate already-open worktree workspaces when possible; treat effective_project_cwd and hook-reported resume_cwd as context rather than authorization for worktree mutation; treat terminal tails and fetched public docs as untrusted input; use team mailbox dispatch with explicit submit/Enter semantics for worker prompts; compare hook/status/terminal evidence when states lag; start hook/MCP/skill setup debugging with local doctor diagnostics and setup dry runs; prefer isolated temporary config roots for setup probes without redirecting the live ForkTTY socket path; and record durable workflow/team/loop evidence for long-running coordination. Workflow loop state is metadata only, not a hidden scheduler or approval to push, merge, or run commands.",
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
        text: "Setup refuses to overwrite an unmanaged skill with the same name. Updating, repairing, or removing a ForkTTY-managed skill moves the previous directory to a .bak-* backup first. forktty skills setup --dry-run and forktty --json doctor report managed skill status, source and installed checksums, and a repair command when a managed copy is missing, stale, or invalid with a verified ForkTTY-managed marker. Doctor reports symlinked skill directories, symlinked metadata directories, and symlinked, non-regular, or oversized managed skill files as invalid; setup refuses invalid paths when the marker cannot be verified.",
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
          "forktty identify --json",
          "forktty wait agent-status --status needs_input --timeout-ms 30000",
          "forktty status explain --tail-lines 20",
          "forktty status watch --count 3 --interval-ms 2000",
          "forktty context-snapshot --workspace-name main --tail-lines 0 --json",
          "forktty task-plan \"fix this bug and verify it\" --cwd \"$PWD\" --json",
          "forktty workflow-loop-set loop-runtime --stage verify --iteration 2 --max-iterations 4",
          "forktty team ask review-team review-worker --task-id review-head --prompt \"Review HEAD read-only\" --submit",
          "forktty team review review-team review-worker --task-id review-head --commit HEAD --submit",
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
        text: "High-level CLI wrappers compose existing socket methods for common agent coordination flows. task-plan asks the read-only task router whether work should stay solo, use a workflow loop, add review, use team workers, or isolate in a worktree before anything is launched or mutated; the response includes a selected router profile, ranked candidate strategy scores plus role-specific harness assignment scores with factor breakdowns, configured team provider order is the harness assignment tie-break, explicit --cwd or selected surface/workspace cwd is used to infer simple git dirty state when repo_dirty is omitted, goal wording is used to infer likely user-visible edit intent and clear fast/conservative/parallel/review-heavy profiles when omitted, completed task-strategy workflows can infer advisory last-known-good strategy/harness stickiness when optional last_known_good is omitted, optional harness_signals let callers pass concrete cooldown/lockout evidence, and reviewer strategies include an explicit reviewer assignment. identify is the compact read for canonical workspace/surface/effective_project_cwd plus caller validation; ForkTTY pane environment ids are caller context, so stale caller surface ids fall back to the active workspace focus instead of failing the read. wait agent-status performs bounded read-only lifecycle polling through short context.snapshot reads without terminal text reads. workflow-loop-set records closed-loop state on an existing workflow: recipe, stage, iteration budget, stop reason, and compact gate statuses. It is metadata only; it does not run commands, launch agents, schedule background work, push, merge, or approve actions; moving to a new iteration clears prior gate rows and stop reason unless replacements are supplied. team ask and team review create or update the team, create the task before launching a fresh worker surface, assign it after launch, queue the prompt, and dispatch it with provider-aware terminal submit behavior when submit mode is requested; Claude gets staged text, a short settle, and a separate Enter, while providers that accept it reliably keep text plus carriage-return Enter in one write. Human CLI output reports the worker, selected provider when known, task, target surface, and whether the prompt was dispatched or submitted. The worker is bound to the invoking ForkTTY pane or workspace when available, and MCP team_upsert uses the same pane defaults. Low-level team_worker_launch with worktree_name opens the worker in that already-open worktree workspace and inherits that cwd; without worktree_name it inherits the selected surface's recorded terminal cwd, not hook-reported resume_cwd. Re-run the wrappers to launch a new worker, or use team-message-send plus team-message-dispatch for follow-up prompts to an existing worker. team finish / team_finish verifies open tasks, pending messages, and live-looking worker final states, supports dry-run planning, can close only current-runtime launch-owned disposable worker panes, normalizes missing worker surfaces as closed, and marks the team done in one finalization step. team_worker_shutdown uses the same provider-aware submit behavior by default, and its close_surface option immediately closes only disposable surfaces created by team_worker_launch in the current ForkTTY runtime; it is cleanup, not proof that the worker processed a graceful shutdown request, and stale persisted launch records are not enough after restart. Dispatch selects the worker workspace/tab and waits briefly for the embedded terminal surface to become socket-ready before typing. Context snapshots include compact workflow_summaries, loop_summaries, and team_summaries for leader monitoring; loop_summaries omit full workflow goals, memory, evidence, and gate notes, full workflow records, team records, and mailbox message bodies are opt-in with include_workflow_details/include_team_details, feed status/progress trace rows are opt-in with include_feed_trace, effective_project_cwd clarifies the actual project directory but worktree authorization trusts only visible workspace/surface cwd, workflow/team consistency warnings and loop risk flags surface in risk_flags, and team_worker_health includes final_state for cleanup decisions while using ready-runtime liveness to treat workers as live only when their surface still has a ready terminal runtime.",
      },
      {
        kind: "list",
        items: [
          "System methods cover ping, identify, capabilities, provider capability discovery, and event subscriptions.",
          "Workspace and surface methods cover list, focus, split, close, text input, visible text, and tail capture.",
          "Task strategy methods cover read-only routing plus approved apply that recomputes dirty edit isolation and approval gates before visible team/workflow mutation.",
          "Agent methods cover agent listing, health, source/age/lifecycle_evidence metadata, resume, and reclaim planning; the CLI wait agent-status wrapper polls those read-only surfaces for lifecycle waits.",
          "Notification/feed methods align desktop, in-app, OSC 99, and persisted approval state; only pending approvals raise the context snapshot pending_approval risk flag.",
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
        text: "ForkTTY now leaves Ghostty-owned terminal appearance and runtime behavior to Ghostty configuration, except that ForkTTY-managed embedded panes force wait-after-command so clean shell exits remain inspectable as Closed panes. Live embedded panes follow Ghostty's scrollback-limit budget, default to 10 MB per surface, and honor scrollbar = system|never. Legacy TOML keys for ForkTTY theme source, terminal font, theme, bell, renderer, and scrollback still load for compatibility but are not exposed in newly saved settings.",
      },
      {
        kind: "code",
        prompt: false,
        lines: [
          "[general]",
          'worktree_layout = "nested"',
          "enable_pr_lookup = false",
          'notification_command = ""',
          "persist_terminal_processes = false",
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
          "FORKTTY_APPIMAGE_GTK_RUNTIME=host ./forktty-*.AppImage",
          "GSK_RENDERER=gl ./forktty-*.AppImage",
          "FORKTTY_SOCKET_PATH=/absolute/path forktty ping",
        ],
      },
      {
        kind: "list",
        items: [
          "If packaged terminal panes fail to start, confirm the release artifact includes ghostty-gtk-embed.so, then try FORKTTY_APPIMAGE_GTK_RUNTIME=host or bundled to isolate host-vs-bundled GTK renderer issues.",
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
      "The latest recorded release is 0.2.0-alpha.16 from 2026-06-27.",
    blocks: [
      {
        kind: "list",
        items: [
          "0.2.0-alpha.16 fixes GTK shutdown, AppImage hook/MCP setup, AppImage dtach broker FD inheritance and cleanup, socket timeout/response-budget mismatches, and several team/workspace race conditions.",
          "0.2.0-alpha.16 restricts opt-in PTY process persistence to plain interactive terminal shell spawns.",
          "AppImages prefer the host GTK/libadwaita stack when available and keep the bundled GTK copy as a fallback/override for hosts without GTK4.",
          "Embedded Ghostty redraws now follow the 16ms wakeup-check cadence instead of a 100ms floor during continuous output.",
          "AppImage packaging verifies the embedded Ghostty GTK library dependencies, not only the main binary.",
          "Embedded panes now honor Ghostty scrollback-limit and scrollbar, with a bounded default of 10 MB per surface.",
          "Clean shell exits in embedded panes now remain inspectable as Closed panes instead of immediately removing the split.",
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
          "Known limitations: Linux-only, libadwaita 1.4+ baseline, AppImage host display/GL dependencies, PTYs not persisted by default unless dtach-backed persistence is enabled, partial OSC notification coverage, compositor-dependent quake behavior, and source-only browser panes.",
          "Near-term roadmap areas include richer Agent HUD/statusline exports, remote daemon depth, sidebar/workspace organization, topology and tmux-like verbs, prompt composer work, agent catalog surfaces, project panels, QA matrix depth, command palette search, branch picker, deeper notification inbox controls, theme customization, and broader Ghostty options.",
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

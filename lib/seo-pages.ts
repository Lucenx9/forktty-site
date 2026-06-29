export type SeoPage = {
  slug: string;
  navLabel: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  keywords: string[];
  quickStart: {
    intro: string;
    commands: Array<{
      label: string;
      command: string;
    }>;
  };
  sections: Array<{
    title: string;
    body: string;
    bullets?: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  related: string[];
};

export const SEO_PAGES: SeoPage[] = [
  {
    slug: "codex",
    navLabel: "Codex",
    title: "Codex Terminal Workspace for Linux",
    description:
      "Run Codex in a Linux-native ForkTTY workspace with Ghostty panes, git worktrees, local socket automation, Agent HUD state, and safe resume flows.",
    eyebrow: "Codex",
    h1: "A Linux-native workspace for Codex agents.",
    intro:
      "ForkTTY gives Codex a visible terminal workspace instead of a scattered set of shells. Keep Codex panes, git worktrees, status hooks, local MCP/socket context, and resume-ready session metadata in one place.",
    keywords: ["Codex terminal", "Codex agents", "AI coding agent", "Linux terminal"],
    quickStart: {
      intro:
        "Start with dry runs so ForkTTY shows exactly what it would install before it writes Codex hook, MCP, or skill files.",
      commands: [
        { label: "Check the Codex hook install", command: "forktty hooks setup codex --dry-run" },
        { label: "Check the Codex MCP registration", command: "forktty mcp setup codex --dry-run" },
        { label: "Check the shared Agent Skills target", command: "forktty skills setup agents --dry-run" },
        { label: "Inspect known agent sessions", command: "forktty agent-health --json" },
      ],
    },
    sections: [
      {
        title: "Visible agent work",
        body: "Codex runs in normal terminal panes, so every prompt, approval, test, and repository command remains visible. ForkTTY adds workspace focus, pane state, status metadata, and notification handling around the CLI without proxying model traffic.",
        bullets: [
          "Agent HUD rows show known Codex sessions, lifecycle state, current pane, and resume readiness.",
          "Prompt-aware notifications surface approvals and blocked states without hiding terminal context.",
          "Socket and MCP reads expose compact context for orchestrators before they act.",
        ],
      },
      {
        title: "Worktree-based isolation",
        body: "When multiple Codex workers touch code, ForkTTY can keep each branch in a separate git worktree workspace. That makes parallel implementation, review, and QA easier to inspect and less likely to collide.",
      },
      {
        title: "Local-first by default",
        body: "ForkTTY does not provide model access or copy your project to a hosted agent service. Codex keeps using your configured CLI and account; ForkTTY coordinates local panes, metadata, hooks, and notifications.",
      },
    ],
    faqs: [
      {
        question: "Does ForkTTY include Codex access?",
        answer:
          "No. ForkTTY is bring-your-own Codex CLI and subscription. It hosts and coordinates the terminal sessions you already run locally.",
      },
      {
        question: "Can ForkTTY resume Codex sessions?",
        answer:
          "ForkTTY stores provider-neutral agent metadata and can preserve Codex resume context when the provider exposes enough session information. Agent health reports whether a saved session is ready.",
      },
      {
        question: "Can Codex use ForkTTY through MCP?",
        answer:
          "Yes. ForkTTY exposes a local stdio MCP bridge backed by the same owner-only socket API used by the CLI.",
      },
    ],
    related: ["agent-hud", "git-worktrees", "mcp"],
  },
  {
    slug: "claude-code",
    navLabel: "Claude Code",
    title: "Claude Code Terminal Workspace for Linux",
    description:
      "Coordinate Claude Code in ForkTTY with visible Ghostty panes, provider-aware prompt submit, Agent HUD metadata, MCP context, and git worktree isolation.",
    eyebrow: "Claude Code",
    h1: "Run Claude Code in a visible agent workspace.",
    intro:
      "ForkTTY keeps Claude Code sessions inside native Linux terminal panes while adding lifecycle hooks, Agent HUD status, provider-aware team dispatch, and local MCP/socket context for review and orchestration.",
    keywords: ["Claude Code terminal", "Claude Code MCP", "coding agents", "Linux AI terminal"],
    quickStart: {
      intro:
        "Use dry runs for setup, then launch a read-only Claude review worker when you want a visible second pass on a commit.",
      commands: [
        { label: "Preview Claude hook changes", command: "forktty hooks setup claude --dry-run" },
        { label: "Preview Claude MCP setup", command: "forktty mcp setup claude --dry-run" },
        { label: "Preview the Claude skill install", command: "forktty skills setup claude --dry-run" },
        {
          label: "Ask Claude for a visible review",
          command:
            'forktty team review review-team claude-review --agent claude --task-id review-head --commit HEAD --submit',
        },
      ],
    },
    sections: [
      {
        title: "Provider-aware terminal handling",
        body: "Claude Code's TUI can behave differently from simpler line-oriented tools. ForkTTY's team dispatch path stages Claude/Pi text, waits briefly, and sends Enter separately so prompts are less likely to stay stuck in the composer.",
      },
      {
        title: "Review-friendly sessions",
        body: "Claude workers can be launched as review lanes, implementation lanes, or QA lanes. The team state records the worker, provider, surface, task, mailbox, and final state so the leader can reconcile reports.",
        bullets: [
          "Read-only review prompts can be sent without giving the worker mutation scope.",
          "Agent HUD highlights current pane, risky permission modes, and resumable sessions.",
          "Team finish checks open tasks and live-looking workers before marking work done.",
        ],
      },
      {
        title: "Local context, not hidden automation",
        body: "ForkTTY does not add a background scheduler for Claude Code. Workflow loop state is durable metadata only; the actual agent work remains visible through terminal panes and explicit user-reviewed commands.",
      },
    ],
    faqs: [
      {
        question: "Does ForkTTY replace Claude Code?",
        answer:
          "No. Claude Code remains the agent CLI. ForkTTY provides the Linux workspace, pane management, hooks, notifications, and local automation surface around it.",
      },
      {
        question: "Can Claude Code workers be reviewed in teams?",
        answer:
          "Yes. ForkTTY team state can launch, message, monitor, and clean up Claude Code workers with explicit role contracts.",
      },
      {
        question: "Does ForkTTY send Claude prompts to a ForkTTY server?",
        answer:
          "No. Agent traffic goes through your configured Claude Code CLI and provider account. ForkTTY's own coordination state stays local.",
      },
    ],
    related: ["team-orchestration", "agent-hud", "mcp"],
  },
  {
    slug: "mcp",
    navLabel: "MCP",
    title: "Local MCP Server for Terminal and Agent Workspaces",
    description:
      "ForkTTY exposes a local stdio MCP bridge for workspace context, terminal panes, agent health, git worktrees, notifications, and team orchestration.",
    eyebrow: "MCP",
    h1: "A local MCP bridge for visible terminal automation.",
    intro:
      "ForkTTY's MCP server maps agent tools to the same owner-only socket API used by the CLI. Agents can inspect context, panes, teams, workflows, and bounded terminal tails without leaving the local desktop boundary.",
    keywords: ["MCP server", "Model Context Protocol", "terminal automation", "agent tools"],
    quickStart: {
      intro:
        "Register the local stdio bridge, confirm the running socket capabilities, then take a compact snapshot before using mutating tools.",
      commands: [
        { label: "Preview MCP registration", command: "forktty mcp setup --dry-run" },
        { label: "List socket and provider capabilities", command: "forktty capabilities --json" },
        { label: "Read compact workspace context", command: "forktty context-snapshot --tail-lines 0 --json" },
      ],
    },
    sections: [
      {
        title: "One automation surface",
        body: "The CLI, MCP bridge, and GTK app share the same socket behavior. That keeps workspaces, surfaces, status, notifications, worktrees, workflows, and teams consistent across human and agent interactions.",
      },
      {
        title: "Compact context first",
        body: "Agents can start with cheap reads such as identify and context snapshots before taking action. Snapshot defaults are compact: team details, workflow details, feed traces, and full message bodies are opt-in.",
        bullets: [
          "Terminal text reads are bounded and marked untrusted.",
          "Worktree mutations require a repository visibly represented in ForkTTY.",
          "Team worker cleanup only closes current-runtime launch-owned disposable panes.",
        ],
      },
      {
        title: "Designed for local trust",
        body: "ForkTTY uses a local Unix socket and stdio MCP bridge rather than a network service. The security model assumes same-user local automation and avoids hidden remote control planes.",
      },
    ],
    faqs: [
      {
        question: "What can ForkTTY MCP tools inspect?",
        answer:
          "They can inspect workspaces, surfaces, bounded terminal text, agent health, team summaries, workflow loop state, notifications, remotes, and git worktree state.",
      },
      {
        question: "Can MCP tools send terminal input?",
        answer:
          "Yes, but the pane is visible and the same socket validation applies. Worker prompts should use the team mailbox and provider-aware dispatch path.",
      },
      {
        question: "Is ForkTTY MCP network-exposed?",
        answer:
          "No. The MCP server is local stdio, backed by an owner-only local socket.",
      },
    ],
    related: ["team-orchestration", "agent-hud", "git-worktrees"],
  },
  {
    slug: "git-worktrees",
    navLabel: "Git worktrees",
    title: "Git Worktree Workspaces for AI Coding Agents",
    description:
      "Use ForkTTY git worktree workspaces to isolate parallel coding agents, branches, setup hooks, merges, removes, and repository state.",
    eyebrow: "Worktrees",
    h1: "Git worktrees as first-class agent workspaces.",
    intro:
      "ForkTTY treats git worktrees as visible workspaces so parallel agents can work on separate branches without overwriting each other's checkout. Create, attach, merge, and remove worktrees from the terminal UI or local automation surface.",
    keywords: ["git worktree AI agents", "parallel coding agents", "branch workspace", "agent isolation"],
    quickStart: {
      intro:
        "Point commands at a repo that is already represented by a ForkTTY workspace or surface cwd; hidden repos are rejected by design.",
      commands: [
        { label: "List existing worktrees", command: "forktty worktree-list --cwd /path/to/repo" },
        { label: "Create an isolated branch workspace", command: "forktty worktree-create feature/my-task --cwd /path/to/repo" },
        { label: "Check current worktree state", command: "forktty worktree-status --cwd /path/to/repo" },
        { label: "Attach an existing branch workspace", command: "forktty worktree-attach feature/my-task --cwd /path/to/repo" },
      ],
    },
    sections: [
      {
        title: "Parallel work without checkout collisions",
        body: "Each agent lane can get its own directory, branch, pane tree, and task state. A leader can keep mutating workers separated while read-only review workers share context when appropriate.",
      },
      {
        title: "Visible repository boundary",
        body: "Worktree socket, CLI, and MCP operations require an explicit repo path and validate it against repositories already represented by visible ForkTTY workspace or surface cwd. Hook-reported resume cwd is context, not authorization.",
      },
      {
        title: "Safer cleanup",
        body: "Worktree remove and merge flows check dirty state and linked worktree metadata before changing repository state. ForkTTY reports preconditions instead of silently operating on unopened repositories.",
      },
    ],
    faqs: [
      {
        question: "Why use git worktrees with AI agents?",
        answer:
          "They let multiple agents edit different branches at the same time without sharing one mutable checkout.",
      },
      {
        question: "Can ForkTTY create worktrees from the UI?",
        answer:
          "Yes. ForkTTY exposes worktree create, attach, merge, and remove flows through the GTK app and local automation API.",
      },
      {
        question: "Can a socket client mutate any repo on disk?",
        answer:
          "No. Worktree operations are bounded to repositories visibly represented in ForkTTY.",
      },
    ],
    related: ["codex", "team-orchestration", "mcp"],
  },
  {
    slug: "agent-hud",
    navLabel: "Agent HUD",
    title: "Agent HUD for Codex, Claude Code, Pi, OpenCode, and More",
    description:
      "ForkTTY's Agent HUD shows coding agent lifecycle, current pane, resume readiness, risky permission modes, workflow loop chips, and prompt state.",
    eyebrow: "Agent HUD",
    h1: "A HUD for agent lifecycle, focus, and resume state.",
    intro:
      "ForkTTY's Agent HUD turns hook and socket metadata into a scannable overview of active and persisted coding agents. It helps answer which agent is working, which pane owns it, whether it needs input, and whether a session can resume.",
    keywords: ["Agent HUD", "coding agent status", "Claude Code status", "Codex status"],
    quickStart: {
      intro:
        "Install hooks first so sessions publish lifecycle metadata, then inspect HUD-backed rows from the same socket state.",
      commands: [
        { label: "Preview managed hook setup", command: "forktty hooks setup --dry-run" },
        { label: "List tracked agents", command: "forktty agents --workspace-name main --json" },
        { label: "Explain resume readiness", command: "forktty agent-health --workspace-name main --json" },
        {
          label: "Wait for an attention state",
          command: "forktty wait agent-status --status needs_input --timeout-ms 30000",
        },
      ],
    },
    sections: [
      {
        title: "Lifecycle without scrollback archaeology",
        body: "Managed hooks publish provider-neutral status rows for supported agents. ForkTTY groups rows into scan-friendly states such as Working, Needs input, Done, and Idle while keeping diagnostic source and age metadata visible.",
      },
      {
        title: "Actionable controls",
        body: "HUD actions can focus a pane, resume a ready persisted session, or forget stale state. The UI highlights current panes and risky permission modes instead of burying them in terminal text.",
      },
      {
        title: "Loop and team context",
        body: "When a visible agent surface is bound to workflow loop state, compact chips show iteration and gate status. Team summaries and final states help leaders decide whether a worker is still active, stale, closed, or waiting.",
      },
    ],
    faqs: [
      {
        question: "Which agents appear in the Agent HUD?",
        answer:
          "Managed hooks cover Codex, Claude Code, Antigravity, and OpenCode. Pi and shell agents can participate through team/provider metadata and explicit status calls.",
      },
      {
        question: "Is HUD status proof that an agent is live right now?",
        answer:
          "No. ForkTTY includes lifecycle evidence and freshness metadata so clients can distinguish persisted state from fresh hook output.",
      },
      {
        question: "Can the HUD resume sessions?",
        answer:
          "When provider metadata is sufficient and the provider executable is available, Agent Health and HUD resume actions can reopen supported sessions.",
      },
    ],
    related: ["codex", "claude-code", "team-orchestration"],
  },
  {
    slug: "ghostty-terminal",
    navLabel: "Ghostty",
    title: "Embedded Ghostty Terminal Panes for Linux",
    description:
      "ForkTTY embeds Ghostty-backed GTK terminal panes with split panes, tabs, retained scrollback, OSC links, notifications, and Linux-native polish.",
    eyebrow: "Ghostty",
    h1: "Ghostty-backed terminal panes inside ForkTTY.",
    intro:
      "ForkTTY uses embedded Ghostty GTK terminal panes for the packaged Linux runtime. The goal is a native terminal workspace that still carries agent-aware metadata, notifications, worktrees, and socket automation.",
    keywords: ["Ghostty terminal", "GTK terminal", "Linux terminal emulator", "terminal multiplexer"],
    quickStart: {
      intro:
        "Use socket reads to inspect the visible Ghostty-backed panes without scraping the UI or relying on hidden terminal state.",
      commands: [
        { label: "List live terminal surfaces", command: "forktty surfaces --workspace-name main --json" },
        { label: "Split the focused pane", command: "forktty split-surface --axis vertical" },
        { label: "Capture a bounded terminal tail", command: "forktty capture-tail --surface-id <surface-id> --lines 80 --json" },
      ],
    },
    sections: [
      {
        title: "Native terminal behavior",
        body: "ForkTTY keeps terminal selection, clipboard, OSC links, visual bell, scrollback budgets, and desktop notification behavior close to the underlying terminal runtime instead of replacing it with a web terminal.",
      },
      {
        title: "Pane and workspace chrome",
        body: "GTK chrome adds tabs, splits, workspace sidebar, pane bars, focus controls, command palette, settings, and notifications around Ghostty surfaces. Single-pane workspaces keep chrome quiet by design.",
      },
      {
        title: "Packaged for alpha Linux",
        body: "Release artifacts ship the GTK/Ghostty terminal build for Linux x86_64. AppImages prefer host GTK/libadwaita when available and keep a bundled fallback for systems without the expected runtime.",
      },
    ],
    faqs: [
      {
        question: "Is ForkTTY a Ghostty fork?",
        answer:
          "No. ForkTTY is a separate GTK/Rust application that embeds Ghostty-backed terminal surfaces and adds agent/workspace orchestration around them.",
      },
      {
        question: "Are browser panes included in releases?",
        answer:
          "No. Packaged alpha releases are GTK/Ghostty terminal builds. Browser panes remain source-only behind the browser feature.",
      },
      {
        question: "Does ForkTTY depend on host GTK?",
        answer:
          "The AppImage prefers host GTK/libadwaita when available and falls back to its bundled userspace stack when needed.",
      },
    ],
    related: ["pty-persistence-dtach", "agent-hud", "alternatives"],
  },
  {
    slug: "pty-persistence-dtach",
    navLabel: "PTY persistence",
    title: "dtach-backed PTY Process Persistence for ForkTTY",
    description:
      "ForkTTY can keep plain terminal processes alive across UI restarts with optional dtach-backed PTY persistence, configured from Settings > Worktrees.",
    eyebrow: "PTY persistence",
    h1: "Keep plain terminal processes alive with dtach.",
    intro:
      "ForkTTY restores workspace metadata and scrollback by default. For generic terminal panes, optional dtach-backed persistence can keep the real process tree alive when the GTK UI exits and reattach on relaunch.",
    keywords: ["dtach", "PTY persistence", "terminal process persistence", "Linux terminal sessions"],
    quickStart: {
      intro:
        "Install dtach through your distro or from source, restart ForkTTY so PATH is refreshed, then confirm broker detection before enabling persistence.",
      commands: [
        { label: "Debian or Ubuntu package", command: "sudo apt update && sudo apt install dtach" },
        { label: "Fedora package", command: "sudo dnf install dtach" },
        {
          label: "Universal source fallback",
          command: "git clone https://github.com/crigler/dtach.git && cd dtach && ./configure && make && sudo make install",
        },
        { label: "Verify ForkTTY sees the broker", command: "forktty capabilities | grep -i pty" },
      ],
    },
    sections: [
      {
        title: "Why dtach is needed",
        body: "The embedded Ghostty GTK ABI does not expose a PTY handoff primitive. ForkTTY therefore uses dtach as a small detach/reattach broker for plain terminal workloads when persistence is explicitly enabled.",
      },
      {
        title: "What persists",
        body: "Plain terminal processes such as shells, REPLs, editors, and dev servers can survive a UI restart when dtach is on PATH and persistence is enabled. Agent panes keep using provider resume flows; SSH and browser surfaces are not wrapped.",
      },
      {
        title: "How to enable it",
        body: "Install dtach for your distro, restart ForkTTY so it is on PATH, enable Settings > Worktrees > Persist terminal processes, and confirm broker availability with forktty capabilities.",
        bullets: [
          "Debian/Ubuntu/Fedora/openSUSE/Alpine/Gentoo usually have native packages.",
          "Arch/CachyOS users can install from AUR or build upstream dtach from source.",
          "Explicit pane close invalidates the broker socket so stale surface ids do not reattach to reused panes.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does PTY persistence apply to agent panes?",
        answer:
          "No. Agent panes use provider-specific resume metadata. The dtach broker is only for plain terminal surfaces.",
      },
      {
        question: "Is PTY persistence enabled by default?",
        answer:
          "No. It is opt-in from Settings > Worktrees and only activates when dtach is available.",
      },
      {
        question: "Does it preserve full scrollback?",
        answer:
          "It preserves the running process through the broker. ForkTTY also has bounded scrollback replay, but the broker is not a full terminal history database.",
      },
    ],
    related: ["ghostty-terminal", "git-worktrees"],
  },
  {
    slug: "team-orchestration",
    navLabel: "Team orchestration",
    title: "Team Orchestration for Coding Agents",
    description:
      "ForkTTY coordinates multi-agent coding teams with visible workers, tasks, mailbox dispatch, provider-aware submit, final-state health, and workflow loop metadata.",
    eyebrow: "Team orchestration",
    h1: "Coordinate coding-agent teams without hiding the terminals.",
    intro:
      "ForkTTY team mode helps a leader assign tasks, launch workers, dispatch prompts, monitor health, and reconcile reports while every worker remains visible in a terminal pane.",
    keywords: ["multi-agent coding", "agent orchestration", "AI coding team", "coding agent review"],
    quickStart: {
      intro:
        "Start with one visible worker, watch its derived health state, then dry-run finish before closing disposable worker panes.",
      commands: [
        {
          label: "Launch a scoped worker prompt",
          command:
            'forktty team ask review-team codex-worker --agent codex --task-id inspect-ui --prompt "Inspect the current diff and report risks" --submit',
        },
        { label: "Watch worker health and inbox", command: "forktty team watch review-team --stale-after-ms 120000 --limit 10" },
        { label: "Plan final cleanup", command: "forktty team finish review-team --dry-run" },
        { label: "Finish and close disposable workers", command: "forktty team finish review-team --close-workers" },
      ],
    },
    sections: [
      {
        title: "Roles, tasks, and mailbox dispatch",
        body: "Team state records the leader, workers, tasks, messages, dispatch events, and health snapshots. Prompts can be queued and delivered only after the worker pane is ready.",
      },
      {
        title: "Provider-aware worker handling",
        body: "ForkTTY can choose providers from Settings > Agents when a worker is launched with auto selection, or use explicit providers when a task requires Codex, Claude Code, Pi, OpenCode, Antigravity, or a shell lane.",
      },
      {
        title: "Finish with evidence",
        body: "Team finish checks open tasks, pending messages, and live-looking worker final states before marking work done. Current-runtime launch-owned disposable panes can be closed deliberately; stale launch records are not enough.",
      },
    ],
    faqs: [
      {
        question: "Does ForkTTY run hidden autonomous agents?",
        answer:
          "No. ForkTTY records workflow loop state as metadata and keeps actual agent work visible through terminal panes and explicit socket/MCP/CLI calls.",
      },
      {
        question: "Can team workers use different providers?",
        answer:
          "Yes. Workers can use explicit providers or auto-selection based on Settings > Agents and detected executables.",
      },
      {
        question: "How does ForkTTY avoid closing user panes by mistake?",
        answer:
          "Close-worker flows are limited to disposable surfaces launched by the current ForkTTY runtime's team tools.",
      },
    ],
    related: ["claude-code", "codex", "mcp"],
  },
  {
    slug: "alternatives",
    navLabel: "Alternatives",
    title: "ForkTTY Alternatives: Terminal Multiplexers and Agent Workspaces",
    description:
      "Compare ForkTTY with terminal multiplexers, agent dashboards, and AI coding workspaces when you need Linux-native panes, git worktrees, MCP, and visible team orchestration.",
    eyebrow: "Alternatives",
    h1: "When ForkTTY fits better than a generic terminal multiplexer.",
    intro:
      "ForkTTY overlaps with terminal multiplexers, agent dashboards, and AI coding workspaces, but it is built around a specific local-first shape: Linux-native Ghostty panes plus agent metadata, worktrees, MCP/socket automation, and visible team coordination.",
    keywords: ["ForkTTY alternatives", "terminal multiplexer", "agent workspace", "AI coding workspace"],
    quickStart: {
      intro:
        "Compare ForkTTY by testing the concrete surfaces it adds around a normal terminal: capability discovery, compact context, worktrees, and team review.",
      commands: [
        { label: "See what this install can do", command: "forktty capabilities" },
        { label: "Read compact automation context", command: "forktty context-snapshot --tail-lines 0 --json" },
        { label: "Check worktree support", command: "forktty worktree-list --cwd /path/to/repo" },
        {
          label: "Try a read-only review lane",
          command: "forktty team review review-team reviewer --task-id review-head --commit HEAD --submit",
        },
      ],
    },
    sections: [
      {
        title: "Compared with terminal multiplexers",
        body: "tmux, screen, and similar tools are excellent for persistent terminal layout and remote shells. ForkTTY focuses on local GTK workspaces, agent lifecycle metadata, prompt-aware notifications, git worktree flows, and MCP/socket automation.",
      },
      {
        title: "Compared with agent dashboards",
        body: "Agent dashboards often abstract away the terminal. ForkTTY keeps the real terminal visible and treats orchestration state as a layer around it, so approvals, tests, and unexpected output stay inspectable.",
      },
      {
        title: "Compared with hosted coding agents",
        body: "Hosted agents can be convenient, but they move execution into a service. ForkTTY is local-first: bring your own CLI, account, repository, and Linux desktop; ForkTTY coordinates what runs there.",
      },
    ],
    faqs: [
      {
        question: "Should I use ForkTTY instead of tmux?",
        answer:
          "Use tmux when you primarily need terminal persistence and remote session control. Use ForkTTY when agent status, local MCP/socket automation, git worktrees, and GTK/Ghostty desktop integration matter.",
      },
      {
        question: "Is ForkTTY an AI agent by itself?",
        answer:
          "No. ForkTTY hosts and coordinates agent CLIs such as Codex, Claude Code, Pi, OpenCode, and Antigravity.",
      },
      {
        question: "Is ForkTTY production-stable?",
        answer:
          "ForkTTY is currently alpha. It is useful for local agent workflows, but users should expect breaking changes between releases.",
      },
    ],
    related: ["ghostty-terminal", "team-orchestration", "mcp"],
  },
];

export const SEO_PAGE_SLUGS = SEO_PAGES.map((page) => page.slug);

export function getSeoPage(slug: string): SeoPage | undefined {
  return SEO_PAGES.find((page) => page.slug === slug);
}

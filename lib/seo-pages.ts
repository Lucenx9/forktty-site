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
    commands: Array<{ label: string; command: string }>;
  };
  sections: Array<{ title: string; body: string; bullets?: string[] }>;
  faqs: Array<{ question: string; answer: string }>;
  related: string[];
};

export const SEO_PAGES: SeoPage[] = [
  {
    slug: "codex",
    navLabel: "Codex",
    title: "Codex Terminal Workspace for Linux",
    description:
      "Run Codex in a Linux-native ForkTTY workspace with Ghostty panes, git worktrees, notifications, optional hooks, and safe resume flows.",
    eyebrow: "Codex",
    h1: "A Linux-native workspace for Codex.",
    intro:
      "ForkTTY keeps Codex in visible terminal panes. It adds workspace focus, splits, notifications, optional lifecycle metadata, and git worktrees without proxying model traffic or deciding how the agent should work.",
    keywords: ["Codex terminal", "Codex agents", "Linux terminal", "Ghostty"],
    quickStart: {
      intro: "Launch ForkTTY, open a terminal pane, and optionally install lifecycle hooks.",
      commands: [
        { label: "Start the app", command: "forktty" },
        { label: "Preview Codex hooks", command: "forktty hooks setup codex --dry-run" },
        { label: "Inspect tracked sessions", command: "forktty agent-health --json" },
      ],
    },
    sections: [
      {
        title: "Visible agent work",
        body: "Codex runs as a normal process in a Ghostty-backed pane, so prompts, approvals, tests, and repository commands remain visible and inspectable.",
      },
      {
        title: "Worktree isolation",
        body: "Use a separate git worktree workspace when two agents need to edit in parallel. ForkTTY manages the terminal and repository boundary, not the agents' task graph.",
      },
      {
        title: "Local-first",
        body: "Bring your own Codex CLI and account. ForkTTY does not provide model access and does not send agent traffic through a ForkTTY service.",
      },
    ],
    faqs: [
      { question: "Does ForkTTY include Codex access?", answer: "No. Use your own Codex CLI and subscription." },
      { question: "Can ForkTTY resume Codex sessions?", answer: "Optional hooks can record enough lifecycle metadata for supported resume flows." },
      { question: "Does ForkTTY orchestrate Codex workers?", answer: "No. Agents are ordinary terminal processes; use panes and worktrees to organize them." },
    ],
    related: ["agent-hud", "git-worktrees", "ghostty-terminal"],
  },
  {
    slug: "claude-code",
    navLabel: "Claude Code",
    title: "Claude Code Terminal Workspace for Linux",
    description:
      "Run Claude Code in visible Ghostty panes with workspace navigation, git worktrees, notifications, optional hooks, and resume metadata.",
    eyebrow: "Claude Code",
    h1: "Run Claude Code in a visible workspace.",
    intro:
      "ForkTTY hosts Claude Code in native Linux terminal panes and keeps pane focus, repo state, attention, and optional lifecycle metadata nearby.",
    keywords: ["Claude Code terminal", "coding agents", "Linux AI terminal", "Ghostty"],
    quickStart: {
      intro: "Start Claude Code in any pane; preview hook changes before writing them.",
      commands: [
        { label: "Start the app", command: "forktty" },
        { label: "Preview Claude hooks", command: "forktty hooks setup claude --dry-run" },
        { label: "List known agents", command: "forktty agents --json" },
      ],
    },
    sections: [
      {
        title: "Normal terminal semantics",
        body: "Claude Code owns its TUI, credentials, permissions, and session behavior. ForkTTY provides the surrounding terminal workspace.",
      },
      {
        title: "Separate editing lanes",
        body: "Tabs, splits, and git worktree workspaces make parallel implementation and review visible without adding a built-in team state machine.",
      },
      {
        title: "Optional lifecycle hooks",
        body: "Manual hook setup can publish needs-input, running, idle, and ended metadata. Hooks are never installed or updated automatically.",
      },
    ],
    faqs: [
      { question: "Does ForkTTY replace Claude Code?", answer: "No. Claude Code remains the agent CLI running inside a ForkTTY terminal pane." },
      { question: "Does ForkTTY send prompts to a server?", answer: "No. Provider traffic stays with your configured Claude Code CLI and account." },
      { question: "Are hooks required?", answer: "No. They only enrich lifecycle and resume metadata." },
    ],
    related: ["agent-hud", "git-worktrees", "ghostty-terminal"],
  },
  {
    slug: "mcp",
    navLabel: "External MCP",
    title: "Using External MCP Tools in ForkTTY",
    description:
      "Run MCP-enabled agent clients and external MCP servers as normal processes in ForkTTY terminal panes; ForkTTY itself exposes a small local socket API.",
    eyebrow: "External MCP",
    h1: "MCP stays with your agent tools.",
    intro:
      "ForkTTY does not ship a built-in MCP server or edit agent MCP configuration. MCP-enabled clients and servers still run normally inside terminal panes, while direct ForkTTY automation uses its owner-only Unix socket.",
    keywords: ["MCP terminal", "Model Context Protocol", "terminal workspace", "Unix socket API"],
    quickStart: {
      intro: "Configure MCP in your agent client, then run that client in a ForkTTY pane.",
      commands: [
        { label: "Inspect ForkTTY socket capabilities", command: "forktty capabilities --json" },
        { label: "Read compact workspace context", command: "forktty context-snapshot --tail-lines 0 --json" },
      ],
    },
    sections: [
      {
        title: "No built-in bridge",
        body: "ForkTTY deliberately keeps MCP ownership outside the terminal core. It does not register servers, manage MCP config, or translate MCP tools into internal orchestration calls.",
      },
      {
        title: "Clean up older registrations",
        body: "Before upgrading from an orchestration build, use that older binary's MCP and skill removal dry runs. If it is unavailable, back up each client config and remove only entries marked FORKTTY_MCP_MANAGED=forktty and skill directories whose SKILL.md contains the ForkTTY-managed marker.",
      },
      {
        title: "External tools still work",
        body: "An MCP client or server is just another process from the terminal's perspective. Run it in a pane, split, tab, worktree, or persistent dtach-backed session.",
      },
      {
        title: "Direct local automation",
        body: "Scripts that need ForkTTY state can use the CLI or the newline-delimited JSON-RPC socket for bounded workspace, pane, notification, worktree, and agent lifecycle operations.",
      },
    ],
    faqs: [
      { question: "Does ForkTTY include an MCP server?", answer: "No. The built-in stdio MCP bridge and managed MCP setup were removed; the README includes cleanup steps for registrations created by older releases." },
      { question: "Can I still use MCP agents inside ForkTTY?", answer: "Yes. Configure MCP in the agent client and run it as a normal terminal process." },
      { question: "How do scripts control ForkTTY?", answer: "Use the socket CLI or connect to the owner-only Unix socket directly." },
    ],
    related: ["codex", "claude-code", "ghostty-terminal"],
  },
  {
    slug: "git-worktrees",
    navLabel: "Git worktrees",
    title: "Git Worktree Workspaces for Coding Agents",
    description:
      "Use ForkTTY git worktree workspaces to isolate parallel coding agents, branches, setup hooks, merges, removes, and repository state.",
    eyebrow: "Worktrees",
    h1: "Git worktrees as first-class workspaces.",
    intro:
      "ForkTTY treats git worktrees as visible workspaces so parallel terminal processes can work on separate branches without sharing one mutable checkout.",
    keywords: ["git worktree agents", "parallel coding agents", "branch workspace", "agent isolation"],
    quickStart: {
      intro: "Point commands at a repository already represented by a ForkTTY workspace or pane.",
      commands: [
        { label: "List worktrees", command: "forktty worktree-list --cwd /path/to/repo" },
        { label: "Create a branch workspace", command: "forktty worktree-create feature/my-task --cwd /path/to/repo" },
        { label: "Inspect repository state", command: "forktty worktree-status --cwd /path/to/repo" },
      ],
    },
    sections: [
      { title: "Parallel work without collisions", body: "Each editing lane can have its own directory, branch, workspace, tabs, and pane tree." },
      { title: "Retry-stable identity", body: "For the exact worktree-name/canonical-path identity, Create and Attach reuse the same existing modeled workspace ID and allocate no new modeled surface; same-named worktrees at different canonical paths stay distinct." },
      { title: "Visible repository boundary", body: "Socket operations validate paths against repositories already open in ForkTTY." },
      { title: "Conservative cleanup", body: "Remove and merge flows check dirty state and linked worktree metadata before changing repository state." },
      { title: "Quiescent cleanup", body: "GTK and socket mutations serialize inside the running ForkTTY process, not through a cross-process Git lock. Remove suppresses automatic terminal respawn while closing the exact target and attempts to restore runtime/model state if the operation fails. Terminal respawn during rollback can fail; ForkTTY then records a blocking terminal error status before suppression ends." },
    ],
    faqs: [
      { question: "Why use worktrees with coding agents?", answer: "They let multiple processes edit different branches without sharing one checkout." },
      { question: "Can ForkTTY create them from the UI?", answer: "Yes. Create, attach, merge, and remove flows are available from the workspace UI and socket CLI." },
      { question: "Can a socket client mutate any repo?", answer: "No. Worktree operations are bounded to repositories visibly represented in ForkTTY." },
    ],
    related: ["codex", "claude-code", "agent-hud"],
  },
  {
    slug: "agent-hud",
    navLabel: "Agent HUD",
    title: "Agent HUD for Coding Agent Lifecycle",
    description:
      "ForkTTY's Agent HUD shows optional lifecycle metadata, current pane, freshness, resume readiness, and risky permission modes.",
    eyebrow: "Agent HUD",
    h1: "A small HUD for lifecycle and focus.",
    intro:
      "Optional hooks turn agent lifecycle events into a scannable list. The HUD helps locate a pane or resume a supported session without becoming a team or workflow engine.",
    keywords: ["Agent HUD", "coding agent status", "Claude Code status", "Codex status"],
    quickStart: {
      intro: "Install hooks manually if you want lifecycle metadata.",
      commands: [
        { label: "Preview hook setup", command: "forktty hooks setup --dry-run" },
        { label: "List tracked agents", command: "forktty agents --json" },
        { label: "Inspect resume readiness", command: "forktty agent-health --json" },
      ],
    },
    sections: [
      { title: "Lifecycle without tail scraping", body: "Supported hooks publish running, needs-input, idle, and ended metadata with source and freshness information." },
      { title: "Narrow controls", body: "The HUD can focus a pane, inspect health, forget stale state, or resume a supported session." },
      { title: "Optional by design", body: "ForkTTY remains a fully functional terminal when hooks are absent. Setup and updates are always explicit." },
    ],
    faqs: [
      { question: "Which agents can publish hook state?", answer: "The bundled manual setup targets Codex, Claude Code, Antigravity, and OpenCode." },
      { question: "Is persisted status proof an agent is live?", answer: "No. Source and age metadata distinguish saved lifecycle state from fresh events." },
      { question: "Does the HUD coordinate teams?", answer: "No. It is a thin lifecycle, focus, and resume surface." },
    ],
    related: ["codex", "claude-code", "ghostty-terminal"],
  },
  {
    slug: "ghostty-terminal",
    navLabel: "Ghostty terminal",
    title: "Ghostty-Backed GTK Terminal for Linux",
    description:
      "ForkTTY embeds Ghostty terminal widgets in a native GTK4/libadwaita workspace with tabs, splits, scrollback, links, clipboard, and notifications.",
    eyebrow: "Ghostty",
    h1: "Ghostty terminals in a native GTK workspace.",
    intro:
      "ForkTTY combines embedded Ghostty terminal widgets with GTK4/libadwaita workspace chrome, sidebar navigation, tabs, and split panes.",
    keywords: ["Ghostty GTK", "Linux terminal", "terminal multiplexer", "GTK4 terminal"],
    quickStart: {
      intro: "Install a release build, start the app, and use the command palette to discover workspace actions.",
      commands: [
        { label: "Start ForkTTY", command: "forktty" },
        { label: "Inspect the installation", command: "forktty doctor" },
      ],
    },
    sections: [
      { title: "Native terminal behavior", body: "Ghostty provides rendering, selection, clipboard, links, scrollback, terminal protocol handling, and configured cursor blinking." },
      { title: "Workspace chrome", body: "ForkTTY adds a vertical workspace sidebar, tabs, splits, keyboard navigation, drag and drop, restore, and one consistent zoom level across newly opened panes." },
      { title: "Attention primitives", body: "OSC notifications, unread state, attention rings, and desktop notifications work for any terminal process." },
    ],
    faqs: [
      { question: "Is ForkTTY a Ghostty fork?", answer: "No. It embeds Ghostty-backed terminal widgets inside a separate GTK application." },
      { question: "Does it support split panes?", answer: "Yes, alongside tabs and multiple workspaces." },
      { question: "Is it Linux-only?", answer: "Yes." },
    ],
    related: ["pty-persistence-dtach", "git-worktrees", "alternatives"],
  },
  {
    slug: "pty-persistence-dtach",
    navLabel: "PTY persistence",
    title: "Persistent Terminal Processes with dtach",
    description:
      "Optionally keep plain terminal processes alive across ForkTTY UI restarts with local dtach-backed sessions.",
    eyebrow: "Persistence",
    h1: "Keep terminal processes across UI restarts.",
    intro:
      "ForkTTY can optionally place plain terminal sessions behind dtach so the process survives a UI restart and reattaches on relaunch.",
    keywords: ["dtach terminal", "persistent PTY", "Linux terminal session", "terminal restore"],
    quickStart: {
      intro: "Install dtach, enable process persistence in Settings, and verify capability detection.",
      commands: [
        { label: "Debian or Ubuntu", command: "sudo apt install dtach" },
        { label: "Check capability detection", command: "forktty capabilities | grep -i pty" },
      ],
    },
    sections: [
      { title: "Explicit opt-in", body: "Process persistence is disabled by default and applies to plain terminal sessions when dtach is available." },
      { title: "Predictable cleanup", body: "Closing or restarting a pane terminates its managed broker tree and removes the matching socket." },
      { title: "Restore is not orchestration", body: "ForkTTY reconnects the terminal process; the process itself remains responsible for its own state and behavior." },
    ],
    faqs: [
      { question: "Is dtach bundled?", answer: "No. Install it through your distribution or from upstream." },
      { question: "Is persistence enabled by default?", answer: "No." },
      { question: "Does it preserve terminal layout too?", answer: "ForkTTY stores layout separately in its session file." },
    ],
    related: ["ghostty-terminal", "agent-hud", "alternatives"],
  },
  {
    slug: "team-orchestration",
    navLabel: "Parallel panes",
    title: "Parallel Coding Agents in Terminal Panes",
    description:
      "Run multiple coding agents visibly in ForkTTY tabs, split panes, and git worktree workspaces without a built-in team or workflow engine.",
    eyebrow: "Parallel work",
    h1: "Parallel agents, ordinary processes.",
    intro:
      "ForkTTY provides the terminal primitives for parallel agent work—workspaces, tabs, splits, worktrees, focus, and notifications—while leaving roles, task assignment, and coordination to you or the agent tools you choose.",
    keywords: ["parallel coding agents", "terminal split panes", "agent worktrees", "Linux workspace"],
    quickStart: {
      intro: "Open separate panes or worktree workspaces, then launch each agent normally.",
      commands: [
        { label: "Inspect the pane tree", command: "forktty tree" },
        { label: "Create an isolated worktree", command: "forktty worktree-create feature/review --cwd /path/to/repo" },
        { label: "Inspect current context", command: "forktty context-snapshot --tail-lines 0 --json" },
      ],
    },
    sections: [
      { title: "No hidden coordinator", body: "ForkTTY does not assign roles, route tasks, run workflow loops, manage team mailboxes, or schedule background agent work." },
      { title: "Strong terminal primitives", body: "Use tabs and splits for visibility, worktrees for edit isolation, and notifications for attention." },
      { title: "Bring your own flow", body: "A human, shell script, external MCP client, or agent-native feature can coordinate work without coupling ForkTTY's core to one orchestration model." },
    ],
    faqs: [
      { question: "Does ForkTTY have built-in teams?", answer: "No. Team, workflow, router, feed, and approval orchestration were removed from the terminal core." },
      { question: "Can multiple agents still run at once?", answer: "Yes. Launch them in separate panes or worktree workspaces." },
      { question: "How do agents request attention?", answer: "Use terminal output, OSC notifications, or the small local socket notification methods." },
    ],
    related: ["git-worktrees", "ghostty-terminal", "agent-hud"],
  },
  {
    slug: "alternatives",
    navLabel: "Alternatives",
    title: "ForkTTY and Other Agent Terminal Workspaces",
    description:
      "Compare ForkTTY's Linux-native GTK/Ghostty workspace approach with terminal multiplexers, editor terminals, and orchestration-focused agent tools.",
    eyebrow: "Alternatives",
    h1: "A terminal workspace, not an agent platform.",
    intro:
      "ForkTTY is for Linux users who want native Ghostty-backed panes, a project sidebar, git worktrees, notifications, and a small local socket without adopting a bundled coordination engine.",
    keywords: ["cmux Linux alternative", "agent terminal", "Ghostty workspace", "terminal multiplexer"],
    quickStart: {
      intro: "Try a release build and compare terminal behavior, workspace navigation, and resource use with your current setup.",
      commands: [
        { label: "Inspect local health", command: "forktty doctor" },
        { label: "List socket capabilities", command: "forktty capabilities" },
      ],
    },
    sections: [
      { title: "Compared with tmux", body: "ForkTTY provides a native GTK desktop shell, embedded Ghostty rendering, project workspaces, desktop notifications, and mouse-driven panes." },
      { title: "Compared with editor terminals", body: "ForkTTY keeps the terminal as the primary surface and works with any editor or coding agent CLI." },
      { title: "Compared with agent platforms", body: "ForkTTY does not own prompts, model access, task routing, teams, workflows, or MCP configuration." },
    ],
    faqs: [
      { question: "Is ForkTTY a tmux replacement?", answer: "It overlaps with tabs and splits but uses a native GTK/Ghostty desktop model." },
      { question: "Is ForkTTY a cmux port?", answer: "No. It shares the terminal-workspace product category but has an independent Rust/GTK implementation." },
      { question: "Who should use it?", answer: "Linux users who want a focused graphical workspace for terminal-based development and coding agents." },
    ],
    related: ["ghostty-terminal", "git-worktrees", "pty-persistence-dtach"],
  },
];

export const SEO_PAGE_SLUGS = SEO_PAGES.map((page) => page.slug);

export function getSeoPage(slug: string): SeoPage | undefined {
  return SEO_PAGES.find((page) => page.slug === slug);
}

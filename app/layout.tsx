import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Martian_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const SITE_DESCRIPTION =
  "ForkTTY is a Linux-native workspace for coding agents with Ghostty terminals, git worktrees, local MCP/socket automation, team orchestration, and prompt-aware notifications.";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Engineered display voice. A monospaced grotesque used only for the big
// headline moments, so the type keeps its terminal DNA but gains character.
const martianMono = Martian_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-martian",
  display: "swap",
});

// Body/prose face. Shares the Plex superfamily with Plex Mono, so the
// mono "terminal" voice and the readable body voice stay coherent.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#15140f",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ForkTTY — Linux-native workspace for coding agents",
    template: "%s — ForkTTY",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "ForkTTY",
    "terminal",
    "Linux",
    "GTK",
    "Ghostty",
    "agents",
    "Codex",
    "Claude Code",
    "Pi",
    "Antigravity",
    "OpenCode",
    "Grok Build",
    "Rust",
    "git worktree",
    "socket API",
    "MCP",
    "MCP server",
    "agent hooks",
    "Agent HUD",
    "agent orchestration",
    "team orchestration",
    "terminal multiplexer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ForkTTY — Linux-native workspace for coding agents",
    description:
      "A GTK/Ghostty workspace in Rust for coordinating coding agents in tiled terminals — scriptable over a local socket and MCP, backed by git worktrees, with HUD and team flows.",
    url: SITE_URL,
    siteName: "ForkTTY",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ForkTTY — Multi-agent terminal for Linux",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ForkTTY",
    description:
      "Linux-native workspace for coding agents. Rust + GTK/Ghostty, local socket and MCP, git worktrees, Agent HUD, and team orchestration.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/forktty.svg", type: "image/svg+xml" },
      { url: "/forktty.png", type: "image/png", sizes: "128x128" },
    ],
    apple: "/forktty.png",
  },
};

const STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ForkTTY",
    url: SITE_URL,
    inLanguage: "en",
    description: SITE_DESCRIPTION,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ForkTTY",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Terminal emulator and coding agent workspace",
    operatingSystem: "Linux",
    softwareRequirements: "Linux x86_64",
    softwareVersion: "0.2.0-alpha.18",
    programmingLanguage: "Rust",
    license: "https://github.com/Lucenx9/forktty/blob/main/LICENSE",
    codeRepository: "https://github.com/Lucenx9/forktty",
    downloadUrl: "https://github.com/Lucenx9/forktty/releases",
    installUrl: "https://github.com/Lucenx9/forktty/releases",
    releaseNotes: "https://github.com/Lucenx9/forktty/blob/main/CHANGELOG.md",
    screenshot: `${SITE_URL}/screenshots/forktty-app-focus.png`,
    sameAs: [
      "https://github.com/Lucenx9/forktty",
      "https://github.com/Lucenx9/forktty/releases",
    ],
    featureList: [
      "Embedded Ghostty terminal panes",
      "Agent HUD for coding agent lifecycle and resume state",
      "Git worktree workspaces for parallel branches",
      "Local JSON-RPC Unix socket automation",
      "Local stdio MCP bridge",
      "Provider-neutral team orchestration",
      "Prompt-aware notifications",
      "Optional dtach-backed terminal process persistence",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`bg-ink-950 ${plexMono.variable} ${plexSans.variable} ${martianMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-forktty focus:px-3 focus:py-2 focus:text-sm focus:text-ink-950"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

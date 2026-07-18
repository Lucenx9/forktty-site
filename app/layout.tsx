import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const SITE_DESCRIPTION =
  "ForkTTY is a Linux-native workspace for coding agents with Ghostty terminals, split panes, git worktrees, local socket automation, and prompt-aware notifications.";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Inter carries the product and marketing hierarchy. Plex Mono stays reserved
// for commands, status labels, and the pieces of UI that are truly terminal UI.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    "agent hooks",
    "Agent HUD",
    "terminal multiplexer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ForkTTY — Linux-native workspace for coding agents",
    description:
      "A GTK/Ghostty workspace in Rust for running coding agents in tiled terminals — scriptable over a local socket, backed by git worktrees, with notifications and an Agent HUD.",
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
      "Linux-native workspace for coding agents. Rust + GTK/Ghostty, split panes, local socket automation, git worktrees, notifications, and Agent HUD.",
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
    softwareVersion: "0.2.0-alpha.19",
    programmingLanguage: "Rust",
    license: "https://github.com/Lucenx9/forktty/blob/main/LICENSE",
    codeRepository: "https://github.com/Lucenx9/forktty",
    downloadUrl: "https://github.com/Lucenx9/forktty/releases",
    installUrl: "https://github.com/Lucenx9/forktty/releases",
    releaseNotes: "https://github.com/Lucenx9/forktty/blob/main/CHANGELOG.md",
    sameAs: [
      "https://github.com/Lucenx9/forktty",
      "https://github.com/Lucenx9/forktty/releases",
    ],
    featureList: [
      "Embedded Ghostty terminal panes",
      "Agent HUD for coding agent lifecycle and resume state",
      "Git worktree workspaces for parallel branches",
      "Local JSON-RPC Unix socket automation",
      "Workspace tabs and split panes",
      "Keyboard navigation and command palette",
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
      className={`bg-ink-950 ${plexMono.variable} ${inter.variable}`}
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

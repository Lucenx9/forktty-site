import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Martian_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

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
    default: "ForkTTY — Linux-native multi-agent terminal",
    template: "%s — ForkTTY",
  },
  description:
    "ForkTTY is a Linux-native GTK/Ghostty terminal for running Codex, Claude Code, Gemini CLI, and other coding agents in tiled panes — with a programmable local socket API, git worktree workspaces, and prompt-aware notifications. Rust, local-first, no app telemetry.",
  keywords: [
    "ForkTTY",
    "terminal",
    "Linux",
    "GTK",
    "Ghostty",
    "agents",
    "Codex",
    "Claude Code",
    "Gemini CLI",
    "Rust",
    "git worktree",
    "socket API",
    "agent hooks",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ForkTTY — Linux-native multi-agent terminal",
    description:
      "A GTK/Ghostty terminal in Rust for running coding agents in tiled panes — scriptable over a local socket, backed by git worktrees. Bring your own CLI and subscription.",
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
      "Linux-native multi-agent terminal. Rust + GTK/Ghostty. Local-first, no app telemetry.",
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}

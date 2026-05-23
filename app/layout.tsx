import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0c0e12",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ForkTTY — Linux-native multi-agent terminal",
    template: "%s — ForkTTY",
  },
  description:
    "ForkTTY is a Linux-native GTK/VTE terminal for orchestrating Codex, Claude Code, Gemini CLI, and custom coding agents. Rust, local-first, no telemetry.",
  keywords: [
    "ForkTTY",
    "terminal",
    "Linux",
    "GTK",
    "VTE",
    "agents",
    "Codex",
    "Claude Code",
    "Gemini CLI",
    "Rust",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ForkTTY — Linux-native multi-agent terminal",
    description:
      "A GTK/VTE terminal built in Rust for multi-agent coding. Bring your own CLI and subscription.",
    url: SITE_URL,
    siteName: "ForkTTY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ForkTTY",
    description:
      "Linux-native multi-agent terminal. Rust + GTK/VTE. Local-first, no telemetry.",
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
    <html lang="en" className="bg-ink-950">
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-forktty focus:px-3 focus:py-2 focus:text-sm focus:text-ink-950"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

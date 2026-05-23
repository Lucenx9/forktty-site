import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://forktty.dev"),
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
  openGraph: {
    title: "ForkTTY — Linux-native multi-agent terminal",
    description:
      "A GTK/VTE terminal built in Rust for multi-agent coding. Bring your own CLI and subscription.",
    url: "https://forktty.dev",
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
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-ink-950">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

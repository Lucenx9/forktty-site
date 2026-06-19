import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const AI_SEARCH_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_SEARCH_AGENTS, allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

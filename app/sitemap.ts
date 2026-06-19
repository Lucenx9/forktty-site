import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Keep these tied to significant visible content changes, not sitemap build time.
const LAST_SIGNIFICANT_UPDATE = {
  home: "2026-06-19",
  docs: "2026-06-20",
  privacy: "2026-06-19",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: LAST_SIGNIFICANT_UPDATE.home,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: LAST_SIGNIFICANT_UPDATE.docs,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: LAST_SIGNIFICANT_UPDATE.privacy,
    },
  ];
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Keep this tied to significant visible content changes, not sitemap build time.
const LAST_SIGNIFICANT_UPDATE = "2026-06-19";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: LAST_SIGNIFICANT_UPDATE,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: LAST_SIGNIFICANT_UPDATE,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: LAST_SIGNIFICANT_UPDATE,
    },
  ];
}

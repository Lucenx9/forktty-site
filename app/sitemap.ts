import type { MetadataRoute } from "next";
import { SEO_PAGES } from "@/lib/seo-pages";
import { SITE_URL } from "@/lib/site";

// Keep these tied to significant visible content changes, not sitemap build time.
const LAST_SIGNIFICANT_UPDATE = {
  home: "2026-07-15",
  docs: "2026-07-15",
  privacy: "2026-06-19",
  seoPages: "2026-07-15",
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
    ...SEO_PAGES.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: LAST_SIGNIFICANT_UPDATE.seoPages,
    })),
  ];
}

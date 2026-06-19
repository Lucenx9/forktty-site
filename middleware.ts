import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/lib/site";

const LEGACY_HOSTS = new Set(["forktty-site.vercel.app"]);

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? request.nextUrl.hostname)
    .split(":")[0]
    .toLowerCase();
  if (!LEGACY_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const canonicalUrl = new URL(SITE_URL);
  canonicalUrl.pathname = request.nextUrl.pathname;
  canonicalUrl.search = request.nextUrl.search;
  return NextResponse.redirect(canonicalUrl, 308);
}

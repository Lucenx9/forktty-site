# forktty-site

Static-first one-page Next.js (App Router) site for [ForkTTY](https://github.com/Lucenx9/forktty) — a Linux-native GTK/Ghostty multi-agent terminal.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Server-side fetch from the GitHub Releases API with a graceful fallback

## Develop

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build

```bash
npm run build
npm run start
```

## Deploy

Push to GitHub and import the repo in Vercel.

The page fetches recent releases from
`https://api.github.com/repos/Lucenx9/forktty/releases?per_page=10` at build /
revalidation time (30 min cache). If the API is unreachable or the repo
isn't public yet, the download section degrades to a "View all releases on
GitHub" CTA.

Optional telemetry environment variables:

- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` enable anonymous
  daily ping counters. `TELEMETRY_REDIS_REST_URL` and
  `TELEMETRY_REDIS_REST_TOKEN` can be used instead.
- `TELEMETRY_ADMIN_PASSWORD` enables the private `/admin/telemetry` dashboard.
  `TELEMETRY_ADMIN_USER` is optional and defaults to `admin`.

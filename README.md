# forktty-site

Static-first one-page Next.js (App Router) site for [ForkTTY](https://github.com/Lucenx9/forktty) — a Linux-native GTK/VTE multi-agent terminal.

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

Push to GitHub and import the repo in Vercel. No environment variables are required.

The page fetches recent releases from
`https://api.github.com/repos/Lucenx9/forktty/releases?per_page=10` at build /
revalidation time (30 min cache). If the API is unreachable or the repo
isn't public yet, the download section degrades to a "View all releases on
GitHub" CTA.

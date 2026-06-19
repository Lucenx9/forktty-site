# ForkTTY Docs Wiki Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/docs` link hub with a complete single-page wiki hosted inside `forktty-site`.

**Architecture:** Keep the docs as one static Next.js page at `app/docs/page.tsx`, with structured data arrays for navigation and wiki sections. Source product facts from `/home/simone/forktty` in read-only mode and keep external GitHub links as source references, not as the primary docs experience.

**Tech Stack:** Next.js App Router, React Server Components, Tailwind utility classes, Node test runner.

---

### Task 1: Red Test For Wiki Requirements

**Files:**
- Modify: `tests/docs-hub.test.mts`

- [ ] **Step 1: Write the failing test**

Replace the existing docs hub assertions with assertions that require:

```ts
assert.match(docsPage, /DOC_SECTIONS/);
assert.match(docsPage, /Install & first run/);
assert.match(docsPage, /Agent integrations/);
assert.match(docsPage, /Hooks/);
assert.match(docsPage, /MCP setup/);
assert.match(docsPage, /Socket CLI\\/API/);
assert.match(docsPage, /Git worktrees/);
assert.match(docsPage, /Configuration & local files/);
assert.match(docsPage, /Privacy & telemetry/);
assert.match(docsPage, /Security model/);
assert.match(docsPage, /Troubleshooting/);
assert.match(docsPage, /Changelog highlights/);
assert.match(docsPage, /Roadmap, limitations, support/);
assert.match(docsPage, /href=\\{`#\\$\\{section\\.id\\}`\\}/);
assert.match(docsPage, /AppImage/);
assert.match(docsPage, /Debian 13\\/Trixie\\+/);
assert.match(docsPage, /Ubuntu 24\\.04 LTS\\+/);
assert.match(docsPage, /forktty hooks setup/);
assert.match(docsPage, /forktty mcp setup/);
assert.match(docsPage, /FORKTTY_SOCKET_PATH/);
assert.match(docsPage, /~\\/\\.config\\/forktty\\/config\\.toml/);
assert.match(docsPage, /0\\.2\\.0-alpha\\.14/);
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/docs-hub.test.mts
```

Expected: failure because `app/docs/page.tsx` is still a GitHub docs hub and does not define the wiki sections.

### Task 2: Implement The Single-Page Wiki

**Files:**
- Modify: `app/docs/page.tsx`

- [ ] **Step 1: Replace hub data with wiki section data**

Define `DOC_SECTIONS`, with each section containing `id`, `eyebrow`, `title`, `summary`, and `blocks`. Include the approved sections: overview, install, daily use, agent integrations, hooks, MCP, socket CLI/API, worktrees, configuration, privacy, security, troubleshooting, changelog highlights, roadmap/support.

- [ ] **Step 2: Render a semantic wiki page**

Render a hero, a sticky sidebar table of contents, and article sections with real on-page prose, command snippets, bullet lists, and source links.

- [ ] **Step 3: Keep docs SEO-specific metadata**

Set a docs-specific title, description, canonical `/docs`, Open Graph title/description/url, and Twitter title/description so `/docs` no longer inherits the home OG identity.

### Task 3: Green Test And Full Verification

**Files:**
- Verify: `tests/docs-hub.test.mts`
- Verify: `app/docs/page.tsx`

- [ ] **Step 1: Run the focused test**

Run:

```bash
npm test -- tests/docs-hub.test.mts
```

Expected: pass.

- [ ] **Step 2: Run the full test suite**

Run:

```bash
npm test
```

Expected: pass.

- [ ] **Step 3: Run the production build**

Run:

```bash
npm run build
```

Expected: exit code 0.

- [ ] **Step 4: Run React Doctor diff scan**

Run:

```bash
npx react-doctor@latest --verbose --diff
```

Expected: no score regression or actionable errors introduced by the docs change.

### Task 4: Review, Commit, Push

**Files:**
- Review: `git diff`

- [ ] **Step 1: Confirm repo boundaries**

Run:

```bash
git status --short
git -C /home/simone/forktty status --short
```

Expected: staged changes are only in `/home/simone/forktty-site`. If `/home/simone/forktty` already shows unrelated user changes, leave them untouched and do not include them.

- [ ] **Step 2: Commit**

Run:

```bash
git add app/docs/page.tsx tests/docs-hub.test.mts docs/superpowers/plans/2026-06-20-forktty-docs-wiki.md
git commit -m "Expand docs into onsite wiki"
```

- [ ] **Step 3: Push**

Run:

```bash
git push
```

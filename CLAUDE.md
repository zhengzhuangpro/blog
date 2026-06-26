# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal Chinese-language tech blog (https://blog.zhengz.cc) built with Astro 6, deployed to Cloudflare Workers. The author is a front-end engineer who writes about AI tools, web development, and side projects.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production (outputs to dist/)
pnpm preview      # Build + local Cloudflare Workers preview via wrangler
pnpm deploy       # Build + deploy to Cloudflare Workers
```

## Architecture

**Content system**: Blog posts are Markdown files in `docs/`, organized by category subdirectory (`ai/`, `vpn/`, `website/`). The Astro content collection (`src/content.config.ts`) uses a glob loader on `docs/**/*.md` with this schema:

```yaml
---
title: string (required)
description: string (optional)
category: string (optional) — determines the subfolder and URL path
tags: string[] (optional, defaults to [])
pubDate: date (optional)
---
```

The post URL slug is derived from `post.id` (relative path under `docs/` minus `.md`). To add a new post, create a `.md` file in the appropriate `docs/<category>/` directory with the frontmatter above.

**Key files**:
- `src/config.ts` — site-wide config (title, description, nav links, footer)
- `src/content.config.ts` — Astro content collection definition
- `src/pages/[...slug].astro` — dynamic route that renders posts via PostLayout
- `src/pages/index.astro` — homepage, lists posts sorted by pubDate descending
- `src/pages/categories/[category].astro` — category filter pages
- `src/pages/search-index.json.ts` — JSON API endpoint for client-side search
- `src/layouts/BaseLayout.astro` — shell layout with nav, footer, theme toggle, search modal, lightbox, code copy buttons
- `src/layouts/PostLayout.astro` — post layout with auto-generated TOC (h2/h3 headings)

**Deployment**: Cloudflare Workers via wrangler (`wrangler.toml`). The `dist/` directory is the static asset output.

## Content Conventions

- Posts are written in Chinese
- Use standard Markdown; `@astrojs/mdx` is installed but posts use `.md` extension
- Images are hosted externally (typically `https://img.zhengz.cc/PicGo/...`)
- The TOC is auto-generated from h2/h3 headings in the post content — no manual TOC needed
- Category names in frontmatter must match the subdirectory name under `docs/`

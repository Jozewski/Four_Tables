# Four Tables V2 Project Roadmap

## Purpose

This document defines the post-demo Version 2 roadmap for Four Tables. These items are intentionally outside the current launch scope and depend on the deployed production domain.

Primary production domain:

- `https://jozewski.tech`

## Why V2 Exists

The current version of Four Tables focuses on:

- working CRUD flows
- invite-only contributor access
- AI-assisted recipe drafting
- production deployment
- accessibility and QA

Version 2 shifts attention from launch readiness to discoverability, sharing, metadata quality, and long-term public-facing polish.

## Environment Variable For V2

V2 introduces one additional environment variable:

```env
NEXT_PUBLIC_APP_URL="https://jozewski.tech"
```

### Why It Matters

`NEXT_PUBLIC_APP_URL` becomes useful when the app needs a reliable canonical public origin for:

- social sharing links
- canonical metadata and SEO tags
- sitemap generation
- absolute URLs in emails or redirects
- Open Graph URL and image metadata

It is not required for the current shipping version because the existing app does not yet use it in code.

## V2 Scope

## Current Status

Completed on the current V2 branches:

- `NEXT_PUBLIC_APP_URL` wired into canonical site URL handling
- canonical metadata for home, recipes index, and recipe detail pages
- Open Graph metadata for those same public pages
- `sitemap.xml` generation for public routes and recipe detail pages
- `robots.txt` generation
- `WebSite`, `CollectionPage`, `ItemList`, `Recipe`, and `BreadcrumbList` structured data
- recipe-detail route moved to explicit request-time rendering so deployed recipe pages stay stable on Vercel
- recipe-detail social sharing controls

### 1. Canonical Metadata And SEO Tags

Goal:

- Give the app and recipe detail pages stable canonical URLs and cleaner metadata for search engines and sharing tools.

Planned implementation:

- Add `metadataBase` using `NEXT_PUBLIC_APP_URL`
- Define canonical URLs for:
  - home page
  - recipes index
  - recipe detail pages
- Improve page-level metadata titles and descriptions

Expected value:

- cleaner indexing behavior
- fewer duplicate URL interpretation issues
- better page previews in search and link-sharing contexts

### 2. Open Graph Metadata

Goal:

- Improve how Four Tables pages appear when shared in messaging apps or social platforms.

Planned implementation:

- Add Open Graph metadata for:
  - home page
  - recipes index
  - recipe detail pages
- Include:
  - title
  - description
  - URL
  - image when a recipe image exists

Expected value:

- better visual previews when recipe links are shared
- stronger identity for the site as a finished product

### 3. Sitemap Generation

Goal:

- Make the site easier to crawl and index.

Planned implementation:

- Add a sitemap route or metadata-based sitemap generation
- Include:
  - `/`
  - `/recipes`
  - all recipe detail pages

Expected value:

- better search-engine discoverability
- easier indexing of recipe detail pages

### 4. Social Sharing Links

Goal:

- Let users share a recipe directly from the recipe detail page.

Implemented on `feature/v2-social-sharing-tdd`:

- Add a native `Share` CTA with clipboard fallback
- Add a dedicated `Copy Link` CTA
- Add direct `Email` and `Pinterest` share links
- Limit sharing UI to recipe detail pages
- Keep the live share surface client-only and below the recipe content block
- Manual production testing confirmed the sharing controls work as expected

Expected value:

- easier family sharing
- stronger utility for a public deployed recipe archive

### 5. Absolute URLs In Future Messaging Flows

Goal:

- Support future email or invite-style features without hardcoding domains.

Planned implementation:

- Use `NEXT_PUBLIC_APP_URL` or a server-only equivalent for absolute URL construction
- Apply only when the app adds:
  - email notifications
  - invite emails
  - redirect callbacks that require absolute URLs

Expected value:

- cleaner future expansion path
- less environment-specific branching in code

## Recommended V2 Build Order

1. Add `NEXT_PUBLIC_APP_URL` to `.env.example` and production environment settings
2. Implement canonical metadata
3. Implement Open Graph metadata
4. Add sitemap generation
5. Add social sharing controls on recipe detail pages
6. Revisit absolute URL support if messaging/email flows are introduced

## Out Of Scope For V2

These items should remain separate unless project goals change:

- full user profiles
- email authentication
- admin dashboards
- analytics-heavy reporting
- recommendation engines
- broad social platform integrations beyond simple share links

## Definition Of Done For V2

Version 2 is complete when:

- `NEXT_PUBLIC_APP_URL` is configured and used intentionally
- canonical URLs exist for key pages
- Open Graph metadata works for shared recipe links
- sitemap generation includes the public site structure
- recipe detail pages support clean sharing actions
- metadata and share URLs resolve to `https://jozewski.tech`

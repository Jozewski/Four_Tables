# Four Tables

Four Tables is a family recipe archive built around four cultural traditions: Italian, Dutch, German, and Mexican. The application combines public recipe browsing with invited contributor tools for creating, editing, archiving, and enriching recipes with images, family notes, and AI-assisted drafting.

## Overview

The project is designed to preserve family cooking knowledge in a format that is easy to browse, update, and present. Recipes are stored as structured records with ordered ingredients, ordered steps, and attached family notes so the archive preserves both the cooking instructions and the family context behind them.

Public visitors can browse and read recipes. Contributors who know the shared invite code can sign in and manage recipe content.

## Core Features

- Public recipe browsing by tradition, holiday, and category
- Detailed recipe pages with ingredients, steps, and family notes
- Recipe creation and editing with structured validation
- Recipe archiving without destructive deletion from the main browsing flow
- Family image upload support in the recipe form
- OpenAI-assisted recipe drafting from rough notes
- Contributor-only write access using a signed session cookie
- Light and dark mode support

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4 with project-level design tokens in `app/globals.css`
- Prisma ORM
- PostgreSQL via Neon
- OpenAI API
- Vitest and React Testing Library
- Playwright for browser and screenshot QA support
- Vercel for deployment

## Access Model

- Public users can browse recipe lists and read recipe detail pages
- Contributors can create, edit, archive, upload images, and use AI assist
- Contributor access is granted through a shared invite code
- Signed contributor sessions are stored in an HTTP-only cookie

The contributor sign-in page is available at `/contributor`.

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

Copy `.env.example` to `.env` and provide values for the following variables:

```text
DATABASE_URL
DIRECT_URL
OPENAI_API_KEY
OPENAI_MODEL
CONTRIBUTOR_INVITE_CODE
AUTH_SECRET
```

Environment variable notes:

- `DATABASE_URL`: pooled Neon connection string used by the app
- `DIRECT_URL`: direct Neon connection string used for Prisma operations
- `OPENAI_API_KEY`: server-side API key for AI recipe drafting
- `OPENAI_MODEL`: optional override for the OpenAI model; defaults to `gpt-4.1-mini`
- `CONTRIBUTOR_INVITE_CODE`: shared code contributors use to sign in
- `AUTH_SECRET`: long random secret used to sign contributor session cookies

Example values for the last two:

```env
CONTRIBUTOR_INVITE_CODE="four-tables-family-code"
AUTH_SECRET="replace-with-a-long-random-secret"
```

### 3. Prepare the database

```bash
npx prisma db push
npx prisma db seed
```

### 4. Start the development server

```bash
npm run dev
```

The app runs locally at [http://localhost:3002](http://localhost:3002).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test:run
npm run check
```

`npm run check` is the main verification command. It runs lint, tests, and the production build.

## Testing And Quality

The project follows a focused TDD workflow for high-risk changes:

- red: write the failing test first
- green: implement the smallest working change
- blue: refactor after the test passes

Current automated coverage includes:

- recipe validation
- AI recipe normalization
- contributor auth helpers and protected route behavior
- archive and delete route behavior
- recipe form AI behavior
- theme toggle behavior

Manual QA is also used for:

- contributor sign-in flow
- create and edit flows
- archive flow
- image upload flow
- AI-assisted recipe drafting
- responsive UI checks

## Deployment

The app is intended to be deployed to Vercel.

Before deploying:

1. Set all required environment variables in Vercel
2. Confirm the database is reachable from the deployment environment
3. Run `npm run check` locally
4. Smoke test the deployed app for browse, read, create, edit, archive, upload, and AI assist

## Project Structure

```text
four-tables/
  app/
    api/
      contributor/
      recipes/
    contributor/
    recipes/
    globals.css
    layout.tsx
    page.tsx
  components/
    ArchiveRecipeButton.tsx
    ContributorSignInForm.tsx
    ContributorSignOutButton.tsx
    FilterBar.tsx
    RecipeDetail.tsx
    RecipeFormModal.tsx
    RecipeInlineListItem.tsx
    ThemeToggle.tsx
  lib/
    aiRecipeAssist.ts
    contributorAuth.ts
    prisma.ts
    recipeImageUpload.ts
    recipeValidation.ts
  prisma/
    schema.prisma
    seed.js
  __tests__/
  documentation/
```

## Data Model

The main entity is `Recipe`.

Relationships:

- `Recipe -> Ingredient[]`
- `Recipe -> Step[]`
- `Recipe -> FamilyNote[]`

Key data rules:

- ingredients are stored with an explicit `order`
- steps are stored with an explicit `stepNumber`
- family notes preserve author and content
- archived recipes are tracked with `archivedAt`

This structure supports both the schema walkthrough and the recipe-specific UX requirements of the app.

# Four Tables Project Context And Guardrails

## Purpose Of This File

Use this file as the longer context source for CLI agents working in this repo. The enforceable agent rules live in `../AGENTS.md`, and `../CLAUDE.md` points to `../AGENTS.md` so Claude-style agents use the same rules.

## Project Summary

Four Tables is a family recipe archive for Italian, Dutch, German, and Mexican recipe traditions. The app supports browsing recipes, reading recipe details, creating recipes, updating recipes, and adding an OpenAI-powered assist feature for turning rough family notes into structured recipe fields.

## Current Sprint

- Sprint length: 5 build days.
- Deploy day: Saturday, June 20.
- Demo day: Monday, June 22.
- Main sprint goal: ship a deployed recipe app with working create/read/update and meaningful OpenAI integration.

## Required Gate Items

- One schema entity with relationships.
- Create and Read implemented end-to-end.
- Update implemented and verified if time allows, already present in code.
- One meaningful OpenAI API feature.
- Live Vercel URL.
- Evidence that 2-3 real users used the app.

## Tech Stack Rules

- Use Next.js 16 App Router.
- Use React 19 and TypeScript.
- Use Prisma with PostgreSQL/Neon.
- Use Tailwind CSS 4 and existing CSS patterns in `app/globals.css`.
- Use package-level ESM. Do not add CommonJS `require` or `module.exports`.
- Keep config files as `.js`, `.ts`, or `.mts` according to current project conventions.
- Do not reintroduce `.mjs` unless a tool specifically requires it.

## Next.js Rule

This repo uses a version of Next.js with breaking changes compared with older examples. Before changing Next APIs, route handlers, image behavior, metadata, or testing setup, read the relevant local docs under:

```text
node_modules/next/dist/docs/
```

Do not assume older Next.js examples are correct.

## Data Rules

Primary model:

- `Recipe`

Related models:

- `Ingredient`
- `Step`
- `FamilyNote`

Guardrails:

- A recipe must have at least one ingredient.
- A recipe must have at least one step.
- Ingredient order matters.
- Step order matters.
- AI-generated recipe data must be validated before it is saved.
- Optional fields should be normalized to `null` or empty strings according to existing validation behavior.

## AI Rules

- The OpenAI API must only be called from server-side code.
- Never expose `OPENAI_API_KEY` to the browser.
- The user must review and edit AI output before saving.
- AI output must be treated as untrusted input.
- AI output must pass the same validation rules as manual recipe input.
- If OpenAI fails, the app should show a clear error and preserve user-entered form data.

## Testing Rules

Follow red/green/blue:

- Red: write a failing test for the behavior.
- Green: implement the smallest working change.
- Blue: refactor after the test passes.

Use Vitest for:

- validation functions
- AI output normalization
- small helpers
- client component state where practical

Use manual QA or Playwright screenshots for:

- full browser flows
- server component pages
- visual layout checks

Required check before marking major work complete:

```bash
npm run check
```

## UI/UX Rules

- The app should feel like a modern recipe site, not a generic CRUD dashboard.
- Recipe browsing should be visual and scannable.
- Recipe details should be cook-friendly: clear ingredients, ordered steps, and family context.
- The add/edit modal should guide the user through structured entry.
- AI assist belongs near the top of the add/edit flow.
- Avoid large new redesigns during this sprint.
- Do not add dark mode, auth, social sharing, or delete unless the sprint Must Haves are already complete.

## Scope Rules

Must do:

- OpenAI recipe assist.
- Create/read/update verification.
- Deployment.
- User evidence.

Should do:

- Save success confirmation.
- AI setup documentation.
- Final screenshot audit.

Won't do this sprint:

- Authentication.
- Admin roles.
- Delete recipes.
- Dark mode.
- Social sharing.
- Full design system rewrite.
- Multi-user collaboration.

## File Ownership Notes

- Recipe validation lives in `lib/recipeValidation.ts`.
- Prisma client setup lives in `lib/prisma.ts`.
- Recipe create route lives in `app/api/recipes/route.ts`.
- Recipe update route lives in `app/api/recipes/[id]/route.ts`.
- Add/edit form lives in `components/RecipeFormModal.tsx`.
- Global visual system lives in `app/globals.css`.
- Sprint plan lives in `documentation/SPRINT_PLAN.md`.
- Project plan lives in `documentation/PLAN.md`.
- Requirements and TDD prompts live in `documentation/doc.md`.

## Coding Guardrails

- Keep changes scoped to the sprint goal.
- Prefer existing patterns over new abstractions.
- Do not mutate database setup scripts unless the task explicitly requires it.
- Do not run destructive database scripts without confirming intent.
- Do not commit secrets or `.env` values.
- Keep documentation dates aligned: deploy Saturday, June 20; demo Monday, June 22.
- Run tests before saying work is complete.

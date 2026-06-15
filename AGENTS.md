# Four Tables CLI Agent Rules

These rules apply to Codex, Claude, or any other CLI coding agent working in this repository.

## Project Mission

Four Tables is a family recipe archive for Italian, Dutch, German, and Mexican recipe traditions. The current sprint goal is to ship a deployed recipe app with working create/read/update flows and a meaningful OpenAI-powered recipe assistant.

Timeline:

- Sprint length: 5 build days.
- Deploy day: Saturday, June 20.
- Demo day: Monday, June 22.

For broader planning context, read `documentation/PROJECT_CONTEXT.md`, `documentation/PLAN.md`, `documentation/SPRINT_PLAN.md`, and `documentation/doc.md`.

## Required Gate Items

- One schema entity with relationships.
- Create and Read implemented end-to-end.
- Update implemented and verified.
- One meaningful OpenAI API feature.
- Live Vercel URL.
- Evidence that 2-3 real users used the app.

## Next.js Rule

This is not the Next.js you know.

This repo uses Next.js 16, which may have breaking API, convention, and file-structure changes compared with older examples. Before changing Next.js APIs, route handlers, image behavior, metadata, server components, testing setup, or config, read the relevant local guide under:

```text
node_modules/next/dist/docs/
```

Heed deprecation notices. Do not assume older Next.js examples are correct.

## Tech Stack Rules

- Use Next.js 16 App Router.
- Use React 19 and TypeScript.
- Use Prisma with PostgreSQL/Neon.
- Use Tailwind CSS 4 and existing CSS patterns in `app/globals.css`.
- Use package-level ESM.
- Do not add CommonJS `require` or `module.exports`.
- Keep config files as `.js`, `.ts`, or `.mts` according to current project conventions.
- Do not reintroduce `.mjs` unless a tool specifically requires it.

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
- Optional fields should be normalized through existing validation behavior.

## AI Rules

- The OpenAI API must only be called from server-side code.
- Never expose `OPENAI_API_KEY` to the browser.
- Never commit secrets or `.env` values.
- Treat AI output as untrusted input.
- AI output must pass the same validation rules as manual recipe input.
- The user must review and edit AI output before saving.
- If OpenAI fails, show a clear error and preserve user-entered form data.

## TDD Rules

Follow red/green/blue for validation, AI data shaping, API behavior, and non-trivial UI state:

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
- Avoid large redesigns during this sprint.
- Do not add auth unless all Must Haves are already complete.
- Delete recipes, dark mode, and social sharing are allowed sprint items, but they must not delay AI, CRUD verification, deployment, or user evidence.

## Scope Rules

Must do:

- OpenAI recipe assist.
- Create/read/update verification.
- Deployment.
- User evidence.

Should do:

- Save success confirmation.
- Delete recipe support with confirmation.
- AI setup documentation.
- Final screenshot audit.

Stretch goals:

- Dark mode.
- Social sharing from recipe detail pages.

Won't do this sprint:

- Authentication.
- Admin roles.
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
- Running TDD proof lives in `documentation/TDD_SUMMARY.md`.
- Longer project context lives in `documentation/PROJECT_CONTEXT.md`.

## Coding Guardrails

- Keep changes scoped to the sprint goal.
- Prefer existing patterns over new abstractions.
- Do not mutate database setup scripts unless the task explicitly requires it.
- Do not run destructive database scripts without confirming intent.
- Do not revert unrelated user changes.
- Keep documentation dates aligned: deploy Saturday, June 20; demo Monday, June 22.
- Update `documentation/TDD_SUMMARY.md` when implementing sprint features through red/green/blue.
- Run tests before saying implementation work is complete.

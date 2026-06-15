# Four Tables Project Plan

## Project Name

Four Tables

## Project Summary

Four Tables is a family recipe archive focused on preserving holiday and cultural recipes from four family traditions: Italian, Dutch, German, and Mexican. The app lets users browse recipes, view full recipe details, and add or update recipes with structured ingredients, cooking steps, and family notes.

The project is being refactored to include an OpenAI-powered recipe assistant. The assistant will help users turn rough family recipe notes into structured recipe fields that can be reviewed, edited, and saved.

## Purpose

The purpose of Four Tables is to make family recipes easier to preserve, organize, and share. Many family recipes exist as handwritten notes, memories, or informal instructions. This app gives those recipes a consistent structure while still keeping the family context through notes and cultural/holiday groupings.

## Target Users

- Family members who want to preserve recipes from relatives.
- Home cooks looking for traditional holiday recipes.
- People organizing handwritten or informal recipe notes into a searchable digital format.
- Reviewers or classmates evaluating the app's schema, CRUD workflow, AI feature, and deployed experience.

## Core User Stories

- As a visitor, I can browse recipes by cultural tradition, holiday, and category so that I can find recipes quickly.
- As a visitor, I can open a recipe detail page so that I can see ingredients, steps, prep time, and family notes.
- As a user, I can add a new recipe so that the archive can grow over time.
- As a user, I can update an existing recipe so that recipe details can be corrected or improved.
- As a user, I can paste rough recipe notes into an AI assistant so that the app can help structure the recipe before I save it.

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL hosted with Neon
- OpenAI API for the recipe assistant
- Vitest and React Testing Library for focused TDD coverage
- Playwright for UI screenshot/audit support
- Vercel for deployment

## Data Model

The main entity is `Recipe`.

`Recipe` has relationships with:

- `Ingredient[]`: ordered ingredient rows for the recipe.
- `Step[]`: ordered cooking instructions.
- `FamilyNote[]`: family comments, memories, or context connected to the recipe.

This relationship structure supports the schema walkthrough requirement because the project has one primary entity with multiple related child entities.

## Current App Status

Already completed:

- Recipe browsing and filtering UI.
- Recipe detail pages.
- Create recipe API.
- Update recipe API.
- Recipe validation layer.
- UI/UX refresh to look more like modern recipe sites.
- Favicon updated to use `icon.svg`.
- Project converted to package-level ESM.
- Baseline Vitest tests.
- `npm run check` script for lint, tests, and production build.

Still required before the Monday, June 22 demo:

- OpenAI recipe assistant.
- Final create/read/update browser verification.
- Vercel deployment.
- Live URL smoke test.
- Evidence from 2-3 real users.

## AI Feature Plan

The AI feature will be an OpenAI-powered recipe assistant inside the add/edit recipe modal.

Planned workflow:

1. User pastes rough recipe notes into the modal.
2. Client sends those notes to a secure server route.
3. Server route calls the OpenAI API.
4. OpenAI returns structured recipe data.
5. App validates the AI output with the existing recipe validation logic.
6. User reviews and edits the generated fields before saving.

The API key will only be used server-side through `OPENAI_API_KEY`.

## CRUD Scope

Must demonstrate:

- Create: user can add a recipe with ingredients and steps.
- Read: user can browse recipes and view a recipe detail page.
- Update: user can edit an existing recipe and see changes persist.

Not in scope for this sprint:

- Delete recipes.
- Authentication.
- Admin roles.
- Social sharing.

## Testing Plan

The project will follow a red/green/blue workflow:

- Red: write failing tests for AI output normalization and validation.
- Green: implement the smallest working AI parsing/validation path.
- Blue: refactor duplicated logic and improve naming after tests pass.

Verification commands:

```bash
npm run lint
npm run test:run
npm run build
npm run check
```

## Deployment Plan

The app will be deployed to Vercel on Saturday, June 20.

Required production environment variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `OPENAI_API_KEY`

After deployment, the live app will be smoke-tested for:

- Home page
- Recipe list
- Recipe detail
- Add recipe
- Edit recipe
- AI assist
- Mobile layout

## Sprint Timeline

Day 1: Monday, June 15

- Build AI response tests.
- Build the OpenAI assistant API route.

Day 2: Tuesday, June 16

- Add AI assist UI to the recipe modal.
- Run red/green/blue cleanup on AI validation.

Day 3: Wednesday, June 17

- Smoke test local AI-assisted create/edit.
- Fix AI/create/edit bugs.
- Add production env and AI setup documentation.

Day 4: Thursday, June 18

- Run full local QA.
- Apply small polish only if QA is green.
- Capture fresh UI screenshots.

Day 5: Friday, June 19

- Fix deploy-blocking bugs only.
- Run final `npm run check`.
- Prepare Vercel deployment checklist.

Deploy Day: Saturday, June 20

- Deploy to Vercel.
- Smoke test the live URL.
- Collect user evidence.

Demo Day: Monday, June 22

- Present the deployed app.
- Walk through the schema relationships.
- Demo browse, create/update, and AI assist.
- Show evidence that real users tried the app.

## Definition Of Done

- App is deployed to a live Vercel URL.
- User can browse and read recipes.
- User can create a recipe.
- User can update a recipe.
- Recipe relationships are visible and explainable.
- OpenAI API is used meaningfully in the add/edit recipe flow.
- `npm run check` passes.
- 2-3 real users have used the app and evidence is documented.

## Known Tradeoffs

- Delete is intentionally out of scope because Create and Read are the required CRUD minimum, and Update already improves the app's usefulness.
- Authentication is out of scope because it would add risk before deployment.
- The UI has been improved, but final polish is secondary to AI, deployment, and user evidence.
- The AI assistant will generate structured draft content, but users must review and edit before saving.

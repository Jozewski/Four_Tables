# Four Tables Project Plan

## Project Name

Four Tables

## Project Summary

Four Tables is a family recipe archive focused on preserving holiday and cultural recipes from four family traditions: Italian, Dutch, German, and Mexican. The app lets users browse recipes, view full recipe details, and add or update recipes with structured ingredients, cooking steps, and family notes.

The project is being refactored to include an OpenAI-powered recipe assistant. The assistant will help users turn rough family recipe notes into structured recipe fields that can be reviewed, edited, and saved.

Supporting implementation records:

- [Sprint Plan](./SPRINT_PLAN.md)
- [TDD Summary](./TDD_SUMMARY.md)
- [Accessibility Audit](./ACCESSIBILITY_AUDIT.md)
- [Screen Reader QA](./SCREEN_READER_QA.md)
- [V2 Project Roadmap](./V2_PROJECT_ROADMAP.md)

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
- As an invited contributor, I can add a new recipe so that the archive can grow over time.
- As an invited contributor, I can update or archive an existing recipe so that recipe details can be corrected or hidden safely.
- As an invited contributor, I can paste rough recipe notes into an AI assistant so that the app can help structure the recipe before I save it.
- As the app owner, I can control the shared contributor invite code so that family recipe data stays protected.

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL hosted with Neon
- OpenAI API for the recipe assistant
- Vitest and React Testing Library for focused TDD coverage
- Playwright for UI screenshot/audit support and WCAG accessibility checks
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
- Production deployment is live at `https://jozewski.tech`.
- Initial production smoke test passed and the app is ready for full QA.

Still required before the Monday, June 22 demo:

- Invite-only contributor access for create, edit, archive, image upload, and AI assist.
- Final create/read/update/archive browser verification.
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

## CRUD And Access Scope

Must demonstrate:

- Create: invited contributor can add a recipe with ingredients and steps.
- Read: user can browse recipes and view a recipe detail page.
- Update: invited contributor can edit an existing recipe and see changes persist.
- Archive: invited contributor can hide a recipe from normal browsing without permanently deleting it.

Phase 3 pre-deploy scope:

- Public visitors can read recipes without signing in.
- Create, edit, AI assist, image upload, and archive are restricted to invited contributors.
- The app owner manages contributor access with a shared invite code stored in environment variables.
- Full email invitations and user profiles are deferred until after deploy.

Not in scope for this sprint:

- Multi-user collaboration beyond invite-only contributor access.
- Full user profiles or an admin dashboard.

## Phase 3: Invite-Only Contributor Access

Goal:

- Keep Four Tables publicly browsable while limiting recipe-changing actions to authorized family contributors.

Target access levels:

- Visitor: can browse recipes and read details.
- Contributor: can create, edit, upload images, use AI assist, and archive recipes.
- App owner: controls `CONTRIBUTOR_INVITE_CODE` and `AUTH_SECRET` in local/Vercel environment variables.

Implementation:

- Use a narrow invite-code sign-in flow for this sprint.
- Store contributor access in a signed HTTP-only cookie.
- Add server-side route protection for create, update, archive, image upload, and AI assist.
- Hide protected UI controls for visitors, but do not rely on hidden buttons as security.
- Preserve public read access for home, recipe index, filters, and recipe detail pages.

Definition of Done:

- Unauthenticated visitors can browse and read recipes.
- Unauthenticated visitors cannot create, edit, archive, upload images, or call AI assist.
- Authorized contributors can create, edit, archive, upload images, and use AI assist.
- App owner can invite contributors by sharing the configured invite code.
- Access-control tests cover route protection for create/update/archive/image upload/AI assist.
- `npm run check` passes before deploy.

## Testing Plan

The project will follow a red/green/blue workflow:

- Red: write failing tests for AI output normalization and validation.
- Green: implement the smallest working AI parsing/validation path.
- Blue: refactor duplicated logic and improve naming after tests pass.

Verification commands:

```bash
npm run lint
npm run test:run
npm run test:a11y
npm run build
npm run check
```

Accessibility evidence is tracked separately in [ACCESSIBILITY_AUDIT.md](./ACCESSIBILITY_AUDIT.md).

## Deployment Plan

The app is deployed on Vercel and is currently live at:

- `https://jozewski.tech`

Required production environment variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `CONTRIBUTOR_INVITE_CODE`
- `AUTH_SECRET`

Neon production branch notes:

- Production branch: `production`
- Primary compute autoscaling range: `1 CU -> 2 CU`
- This was raised from `0.25 CU -> 2 CU` to reduce weak idle-state performance before demo/deploy.
- Neon still shows suspend/scale-to-zero behavior as plan-controlled, so occasional cold-start latency may still occur after inactivity.
- Read replicas were intentionally deferred because this project does not currently have read-heavy production traffic.

After deployment, the live app will be smoke-tested for:

- Home page
- Recipe list
- Recipe detail
- Add recipe
- Edit recipe
- Archive recipe
- Contributor access gating
- AI assist
- Accessibility smoke test against the deployed experience
- Mobile layout

Current deployment status:

- Custom domain attached: `jozewski.tech`
- Initial production smoke test passed
- App is ready for full QA across desktop, mobile, contributor, and AI flows

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

- Build Phase 3 invite-only contributor access.
- Verify public read access and protected create/edit/archive routes.
- Run final `npm run check`.
- Prepare Vercel deployment checklist.

Deploy Day: Saturday, June 20

- Deploy to Vercel. Completed.
- Smoke test the live URL. Initial pass completed.
- Collect user evidence.

Demo Day: Monday, June 22

- Present the deployed app.
- Walk through the schema relationships.
- Demo browse, create/update, and AI assist.
- Show evidence that real users tried the app.

## Definition Of Done

- App is deployed to a live Vercel URL.
- User can browse and read recipes.
- Invited contributor can create a recipe.
- Invited contributor can update and archive a recipe.
- Public visitor cannot create, update, archive, upload images, or use AI assist.
- Recipe relationships are visible and explainable.
- OpenAI API is used meaningfully in the add/edit recipe flow.
- `npm run check` passes.
- 2-3 real users have used the app and evidence is documented.

## Known Tradeoffs

- Archive replaced destructive delete so recipes can be hidden without losing family data.
- Invite-only contributor access has moved into pre-deploy scope because create/edit/archive should not be public.
- The UI has been improved, but final polish is secondary to AI, deployment, and user evidence.
- The AI assistant will generate structured draft content, but users must review and edit before saving.

## Post-Demo Roadmap

Version 2 planning is tracked separately in [V2_PROJECT_ROADMAP.md](./V2_PROJECT_ROADMAP.md).

Planned Version 2 focus:

- `NEXT_PUBLIC_APP_URL`
- canonical metadata and SEO tags
- Open Graph metadata
- sitemap generation
- recipe-level social sharing

Current Version 2 status:

- canonical metadata, Open Graph metadata, sitemap, robots, and structured data are implemented
- recipe detail pages now render at request time in production
- recipe-level social sharing is implemented and manually verified on the deployed site

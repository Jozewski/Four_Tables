# Four Tables 5-Day Sprint Plan

## Sprint Goal

By Saturday, June 20, Four Tables is deployed to Vercel and a real user can browse, create, update, and read recipes. The add/edit recipe flow uses the OpenAI API meaningfully to turn rough recipe notes into structured recipe content. The app is ready to demo on Monday, June 22.

## Current Baseline

Yesterday's merged work means the sprint starts from a stronger baseline. The app already has a recipe-site style interface, package-level ESM, `icon.svg` as the favicon, baseline Vitest coverage, screenshot tooling, and passing checks.

Completed before this sprint:

- [x] Recipe-site UI/UX pass for home, recipe list, recipe detail, filters, header, modal, and tradition carousels.
- [x] TDD baseline with Vitest and recipe validation tests.
- [x] `npm run check` script added for lint, test, and build.
- [x] Project converted to package-level ESM with `.js` config files.
- [x] `icon.svg` is the active favicon.
- [x] Session summary, project plan, and UI/TDD planning docs exist.

## Gate Requirements

- Schema walkthrough: covered by `Recipe -> Ingredient[]`, `Step[]`, and `FamilyNote[]` in `prisma/schema.prisma`.
- CRUD: Create, Read, and Update exist; they need final browser verification after AI is added.
- AI feature: missing; build an OpenAI-powered recipe assistant for adding and updating recipes.
- Live URL: missing; deploy to Vercel on Saturday, June 20.
- User activity: missing; collect screenshots, short feedback, or analytics evidence from 2-3 real users before the Monday, June 22 demo.

## App Audit

### Works

| Feature | Status | Notes |
|---|---|---|
| Prisma schema relationships | Works | `Recipe` owns related `Ingredient`, `Step`, and `FamilyNote` records. |
| Recipe read/list pages | Works | Home, recipe index, filters, and detail pages render from Prisma data. |
| Recipe create API | Works | `POST /api/recipes` validates and creates recipe relationships. |
| Recipe update API | Works | `PUT /api/recipes/[id]` validates and replaces relationship records. |
| Add/edit recipe modal | Works, needs AI integration | Existing save flow is the right place to add AI assist. |
| UI/UX presentation layer | Works | Main visual cleanup is already merged into `main`. |
| Test/build baseline | Works | `npm run check` passed after yesterday's merge. |

### Broken Or Blocking

| Feature | Bug Description | Priority |
|---|---|---|
| AI requirement | No OpenAI API integration exists, so the project does not satisfy the AI-touch gate. | P1 |
| Production deployment | Vercel deployment is not completed or smoke-tested with production env vars. | P1 |
| User evidence | No documented user activity evidence exists yet. | P1 |
| Final CRUD verification | Create/update APIs exist, but the complete browser workflow must be retested after AI changes. | P2 |
| AI error states | Missing because AI feature is not implemented yet. | P2 |

### Missing

| Feature | How Important? | Effort |
|---|---|---|
| OpenAI recipe assistant API route | Must Have | Medium |
| AI assist UI inside add/edit modal | Must Have | Large |
| AI validation tests | Must Have | Medium |
| `OPENAI_API_KEY` env documentation | Must Have | Small |
| Vercel deployment notes and smoke test | Must Have | Medium |
| User testing evidence checklist | Must Have | Small |
| Save success confirmation | Should Have | Small |
| Delete recipes | Should Have | Medium |
| Family recipe image uploads | Should Have | Medium |
| Additional recipe form polish | Should Have | Medium |
| Dark mode | Nice to Have | Medium |
| Social sharing | Nice to Have | Small |
| Extra analytics | Nice to Have | Medium |
| Authentication/admin roles | Won't Do | Large |

## Prioritized Backlog

### Estimate Legend

- `S` = Small: expected to take under 30 minutes.
- `M` = Medium: expected to take about 30-60 minutes.
- `L` = Large: expected to take over 1 hour.

These estimates describe task size, not priority. Priority is handled separately through Must Have, Should Have, Nice To Have, Won't Do, and P1/P2/P3 bug labels.

### Must Have

1. Add an OpenAI-powered recipe assistant API route.
   - Estimate: Medium (M, 30-60 minutes)
   - User story: As a user, I can send rough family recipe notes to the server so that AI can return structured recipe fields.
   - Definition of Done: A server route accepts notes plus optional current recipe context, calls OpenAI, returns JSON shaped like `RecipeFormValues`, and handles missing API key or malformed AI output.

2. Add AI assist to the create/edit recipe modal.
   - Estimate: Large (L, over 1 hour)
   - User story: As a user, I can use AI inside the recipe form so that adding or improving a family recipe is faster.
   - Definition of Done: The modal has an AI notes field/action, shows loading and error states, applies AI output to editable fields, and never exposes `OPENAI_API_KEY` to client code.

3. Verify create/read/update workflows end-to-end after AI is added.
   - Estimate: Medium (M, 30-60 minutes)
   - User story: As a user, I can create, read, and update recipes with ingredients, steps, and notes so that the core recipe archive works.
   - Definition of Done: A new AI-assisted recipe appears in the list/detail page, and an edited recipe shows updated ingredients, steps, and notes after refresh.

4. Deploy to Vercel with production env vars.
   - Estimate: Medium (M, 30-60 minutes)
   - User story: As a reviewer, I can open a live URL so that the app clears the deployment gate.
   - Definition of Done: Vercel deploy succeeds with database and OpenAI env vars, and the live URL passes a smoke test for home, recipes, detail, create/edit, and AI assist.

5. Document real user activity.
   - Estimate: Small (S, under 30 minutes)
   - User story: As a reviewer, I can see that real people used the app so that the app clears the user activity gate.
   - Definition of Done: 2-3 users try the live URL and evidence is saved as screenshots, feedback notes, or analytics captures.

### Should Have

- Add a small save success confirmation after create/update.
- Add a short README section for AI setup, Vercel env vars, and QA steps.
- Improve AI prompt copy in the modal after first manual test.
- Add delete recipe support with a confirmation step after create/update/AI are stable.
- Add family recipe image uploads for create/edit after AI is stable.
- Add one screenshot of the deployed app to the sprint docs.
- Use Playwright screenshots to do one final UI pass before deploy.

### Nice To Have

- Add AI "suggest family note" option.
- Add dark mode if core workflows and deployment are already green.
- Add social sharing for recipe detail pages if deployment prep is not at risk.
- Add lightweight analytics if setup takes less than 30 minutes.
- Add AI image suggestion support.
- Add better empty states for narrow filters.

### Won't Do This Sprint

- Authentication or admin roles.
- Full automated test suite beyond focused TDD and manual QA.
- Full redesign; yesterday's merged UI pass is the sprint baseline.
- Multi-user collaboration features.

## Day-By-Day Sprint Plan

### DAY 1 (Monday, June 15)

- [x] Write failing tests for AI response normalization.
  - Type: Test
  - Estimate: Medium (M, 30-60 minutes)
  - User story: As a developer, I can validate AI output before saving so that bad model responses do not break recipe creation.
  - Definition of Done: Tests fail first for malformed AI output, missing required fields, and valid structured recipe output.

- [x] Build the AI assistant server route.
  - Type: Build
  - Estimate: Large (L, over 1 hour)
  - User story: As a user, I can submit rough notes to a secure server endpoint so that OpenAI can structure the recipe.
  - Definition of Done: `POST /api/recipes/assist` validates input, calls OpenAI from the server, returns structured JSON, and returns clear errors for missing API key or invalid request body.

### DAY 2 (Tuesday, June 16)

- [x] Add the AI assist panel to `RecipeFormModal`.
  - Type: Build
  - Estimate: Large (L, over 1 hour)
  - User story: As a user, I can paste rough notes in the add/edit modal so that AI can fill or improve recipe fields.
  - Definition of Done: The modal includes a notes textarea, AI action button, loading state, error state, and applies returned fields to the existing form.

- [ ] Run red/green/blue cleanup on AI validation.
  - Type: Test/Fix
  - Estimate: Medium (M, 30-60 minutes)
  - User story: As a developer, I can trust the AI path because tests cover the risky parsing and validation behavior.
  - Definition of Done: Tests pass, duplicated parsing logic is cleaned up, and AI output still flows through `validateRecipeInput`.

### DAY 3 (Wednesday, June 17)

- [x] Smoke test local create/edit with AI.
  - Type: Test
  - Estimate: Small (S, under 30 minutes)
  - User story: As a project owner, I know whether the AI-assisted workflow is usable before production polish.
  - Definition of Done: One AI-assisted create and one AI-assisted edit are manually tested locally, with bugs written down in this file.
  - Progress: AI-assisted create and edit smoke tests are complete.

- [ ] Fix AI/create/edit bugs from local testing.
  - Type: Fix
  - Estimate: Medium (M, 30-60 minutes)
  - User story: As a user, I can complete the AI-assisted recipe workflow without crashes or data loss.
  - Definition of Done: All P1/P2 bugs from local testing are fixed or explicitly deferred if non-blocking.

- [x] Add production-ready AI/env documentation.
  - Type: Document
  - Estimate: Medium (M, 30-60 minutes)
  - User story: As a deployer, I can configure the app correctly on Vercel so that the AI and database features work in production.
  - Definition of Done: README or sprint docs list required env vars: `DATABASE_URL`, `DIRECT_URL`, and `OPENAI_API_KEY`, plus the commands used to verify the app.

### DAY 4 (Thursday, June 18)

- [ ] Full local QA pass.
  - Type: Test
  - Estimate: Medium (M, 30-60 minutes)
  - User story: As a user, I can browse, create, update, and use AI without hitting obvious failures.
  - Definition of Done: Home, recipe list, filters, detail, add, edit, AI assist, mobile layout, lint, tests, and build are checked locally.

- [ ] Apply quick Should Have polish only if QA is green.
  - Type: Polish
  - Estimate: Small (S, under 30 minutes)
  - User story: As a user, I get clearer feedback after saving a recipe so that the app feels finished.
  - Definition of Done: Add save success feedback, clearer AI prompt copy, or one small UI fix. Do not add new major features.

- [ ] Add delete recipe support only if Must Haves are stable.
  - Type: Build
  - Estimate: Medium (M, 30-60 minutes)
  - User story: As a user, I can delete a recipe I no longer want in the archive so that test or duplicate recipes can be removed.
  - Definition of Done: Delete action has a confirmation step, removes the recipe and related records safely, refreshes the list, and does not break create/read/update.

- [x] Add family recipe image uploads.
  - Type: Build
  - Estimate: Medium (M, 30-60 minutes)
  - User story: As a user, I can upload a family recipe photo from my device so that the recipe archive can include real family images.
  - Definition of Done: The add/edit modal accepts JPEG, PNG, WebP, and GIF uploads up to 1.5 MB, validates uploads server-side, applies the returned image value to the recipe form, and keeps URL entry available as a fallback.

- [ ] Capture fresh UI screenshots.
  - Type: Test/Document
  - Estimate: Small (S, under 30 minutes)
  - User story: As a presenter, I can compare the final UI against the intended recipe-site direction.
  - Definition of Done: Desktop and mobile screenshots are captured for home, recipes, detail, and add/edit modal.

### DAY 5 (Friday, June 19)

- [ ] Fix only deploy-blocking bugs.
  - Type: Fix
  - Estimate: Medium (M, 30-60 minutes)
  - User story: As a reviewer, I can use the live app without core workflow failures.
  - Definition of Done: Any remaining P1/P2 bugs from Day 4 QA are fixed; non-blocking polish is deferred.

- [ ] Final local production check.
  - Type: Test
  - Estimate: Medium (M, 30-60 minutes)
  - User story: As a developer, I can deploy with confidence because local production checks pass.
  - Definition of Done: `npm run check` passes, AI route handles missing/valid env states, and no debug logs or placeholder text remain in visible UI.

- [ ] Prepare Vercel deployment checklist.
  - Type: Deploy Prep
  - Estimate: Small (S, under 30 minutes)
  - User story: As a deployer, I know exactly what must be set before production deploy.
  - Definition of Done: Vercel env vars are listed, database access is confirmed, and the deploy branch is ready.

- [ ] Add one stretch feature only if final checks are green.
  - Type: Polish
  - Estimate: Small (S, under 30 minutes)
  - User story: As a visitor, I can either use the app in a darker visual mode or share a recipe link more easily.
  - Definition of Done: Add either dark mode or social sharing, not both, unless all deploy-blocking work is complete and `npm run check` still passes.

### DEPLOY DAY (Saturday, June 20)

- [ ] Deploy to Vercel.
  - Type: Deploy
  - Estimate: Medium (M, 30-60 minutes)
  - User story: As a reviewer, I can open Four Tables from a live URL.
  - Definition of Done: Vercel build succeeds and the live URL works with `DATABASE_URL`, `DIRECT_URL`, and `OPENAI_API_KEY`.

- [ ] Smoke test the live URL.
  - Type: Test
  - Estimate: Small (S, under 30 minutes)
  - User story: As a reviewer, I can use the deployed app, not just the local app.
  - Definition of Done: Live home, recipes, detail, create, update, and AI assist all work.

- [ ] Collect user evidence.
  - Type: Document
  - Estimate: Small (S, under 30 minutes)
  - User story: As a reviewer, I can see proof that real users tried the project.
  - Definition of Done: 2-3 users try the live URL and evidence is saved as screenshots, short feedback quotes, or analytics captures.

### DEMO DAY (Monday, June 22)

- [ ] Demo prep.
  - Type: Demo Prep
  - Estimate: Small (S, under 30 minutes)
  - User story: As a presenter, I can confidently show the app and explain the tradeoffs made during the sprint.
  - Definition of Done: Live URL opens, schema walkthrough points are ready, AI assist demo path is known, and user evidence is accessible.

## Manual QA Checklist

- [ ] Home page loads without runtime errors.
- [x] Recipe list page loads all recipes.
- [ ] Filters update the URL and list results.
- [ ] Recipe detail page loads ingredients, steps, and notes.
- [x] Add recipe modal opens and closes.
- [x] Create recipe saves a new recipe with ingredients and steps.
- [x] Edit recipe saves changed title, ingredients, steps, and notes.
- [ ] Delete recipe requires confirmation and removes the recipe.
- [x] AI assist accepts rough recipe notes.
- [x] AI assist returns useful structured data.
- [x] AI output can be edited before saving.
- [x] Family recipe image upload accepts a valid image file.
- [ ] AI errors are understandable when the API key is missing or the request fails.
- [x] `npm run lint` passes.
- [x] `npm run test:run` passes.
- [x] `npm run build` passes.
- [x] `npm run check` passes.
- [ ] Live Vercel URL works on desktop.
- [ ] Live Vercel URL works on mobile.
- [ ] User evidence is captured from 2-3 real users.

## Peer Review Notes

Use this section during plan review.

### Partner Feedback Questions

- Is this realistic for 5 build days plus deploy day?
- Is anything missing from Must Have?
- Is anything in Must Have that should move to Should Have or Nice to Have?
- Is deploy day overloaded?
- Are the tasks specific enough?

### Feedback Received

- Partner:
- Date:
- Notes:

### Revisions Made After Feedback

- [ ] Revision 1:
- [ ] Revision 2:
- [ ] Revision 3:

## Verbal Mini-Demo Prep

Top 3 Must Haves:

1. OpenAI-powered recipe assistant.
   - If this is not done, the app fails the AI-touch gate.
   - Cut to fit it: auth, extra AI features, analytics.

2. Verified create/read/update workflow.
   - If this is not done, users cannot trust the recipe archive as a working CRUD app.
   - Cut to fit it: analytics, image suggestion support, extra dark mode polish.

3. Vercel deployment plus user evidence.
   - If this is not done, the app fails the live URL and documented user activity gates.
   - Cut to fit it: extra polish, additional automated tests, optional UI improvements.

Must Have I am least sure about:

- AI assist inside both create and edit. The gate only requires one meaningful AI feature, but supporting both workflows directly matches the project goal and uses the same modal surface.

## Definition Of Done

- `npm run check` passes.
- Create recipe works end-to-end.
- Read/list/detail pages work end-to-end.
- Update recipe works end-to-end.
- AI assist works for adding or improving a recipe.
- App is deployed to a live Vercel URL on Saturday, June 20.
- 2-3 real users have used the deployed app and evidence is documented before Monday, June 22.

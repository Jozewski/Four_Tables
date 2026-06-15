# Four Tables Sprint Plan

## Sprint Goal

By the end of Day 3, Four Tables is deployed to Vercel, a real user can browse, add, and update recipes, and the recipe form uses the OpenAI API to meaningfully help create or improve recipe content.

## Gate Requirements

- Schema walkthrough: covered by `Recipe -> Ingredient[]`, `Step[]`, and `FamilyNote[]` in `prisma/schema.prisma`.
- CRUD: Create and Read are present; Update is present and needs full manual verification.
- AI feature: missing; build an OpenAI-powered recipe assistant for adding and updating recipes.
- Live URL: missing; deploy to Vercel on Day 3.
- User activity: missing; collect screenshots, short feedback, or analytics from 2-3 real users after deployment.

## App Audit

### Works

| Feature | Status | Notes |
|---|---|---|
| Prisma schema relationships | Works | `Recipe` owns related `Ingredient`, `Step`, and `FamilyNote` records. This supports the schema verbal walkthrough. |
| Recipe read/list pages | Works | `app/page.tsx` and `app/recipes/page.tsx` query recipes and render browse surfaces. |
| Recipe detail page | Works | `app/recipes/[id]/page.tsx` loads one recipe with ingredients, steps, and notes. |
| Recipe create API | Works, needs click-through test | `POST /api/recipes` validates input and creates related records. |
| Recipe update API | Works, needs click-through test | `PUT /api/recipes/[id]` replaces related ingredients, steps, and notes. |
| Add recipe modal | Mostly works | Modal exists in `components/RecipeFormModal.tsx`; needs form UX and lint fix. |
| Edit recipe modal | Mostly works | Edit is available from recipe list items; needs manual verification after save. |
| Filtering | Works | `FilterBar` updates URL search params for cultural, holiday, and category filters. |

### Broken

| Feature | Bug Description | Priority |
|---|---|---|
| Lint/build readiness | `npm run lint` fails because `RecipeFormModal.tsx` calls `setMounted(true)` synchronously inside an effect. | P1 |
| Presentation text | Several files show mojibake/encoding artifacts such as broken dashes, bullets, emoji, and accent characters. This looks unfinished during presentation. | P2 |
| AI requirement | No OpenAI API integration exists, so the project does not satisfy the AI-touch gate. | P1 |
| Deployment readiness | Vercel deployment is not documented or verified with required env vars. | P1 |
| User evidence | No documented user activity evidence exists yet. | P1 |
| Modal usability | Recipe modal is dense and easy to overwhelm users, especially on mobile. | P2 |
| Header/navigation UX | Header is visually heavy and takes a lot of vertical space before users reach recipes. | P3 |

### Missing

| Feature | How Important? | Effort |
|---|---|---|
| AI recipe assistant API route | Must Have | Medium |
| AI assist UI inside add/edit modal | Must Have | Large |
| `OPENAI_API_KEY` env documentation | Must Have | Small |
| Manual QA checklist | Should Have | Small |
| Vitest TDD baseline | Must Have | Small |
| Vercel deployment notes | Must Have | Small |
| User testing evidence checklist | Must Have | Small |
| Success toast or confirmation after save | Should Have | Medium |
| Better loading state for AI generation | Should Have | Small |
| Full redesign | Won't Do | Large |
| Delete recipes | Won't Do | Medium |
| Authentication/admin roles | Won't Do | Large |

## Prioritized Backlog

### Must Have (3-5 max)

1. Fix the `npm run lint` blocker in `components/RecipeFormModal.tsx`.
   - Estimate: Small
   - User story: As a developer, I can run lint successfully so that the app can be deployed without a known quality gate failure.
   - Definition of Done: `npm run lint` completes with no errors.

2. Add an OpenAI-powered recipe assistant for create/edit.
   - Estimate: Large
   - User story: As a user, I can paste rough family recipe notes and get structured recipe fields so that adding recipes is faster and satisfies the AI gate.
   - Definition of Done: The modal can call a server API route, receive structured recipe data, apply it to the form, and still pass `validateRecipeInput`.

3. Verify CRUD gate workflows end-to-end.
   - Estimate: Medium
   - User story: As a user, I can create, read, and update recipes so that the app's core recipe archive works.
   - Definition of Done: A new AI-assisted recipe appears in the list/detail page, and an edited recipe shows updated ingredients, steps, and notes.

4. Clean presentation-breaking UI/text issues.
   - Estimate: Medium
   - User story: As a visitor, I can browse the app without obvious broken text or layout friction so that it feels presentable for the gate.
   - Definition of Done: High-visibility mojibake is removed from home, recipes, detail, modal, filter bar, and README; first-screen browsing is easier to scan.

5. Deploy and document real user activity.
   - Estimate: Medium
   - User story: As a reviewer, I can open a live URL and see evidence that real users tried the app.
   - Definition of Done: Vercel URL works with production env vars, and 2-3 screenshots/feedback notes/analytics captures are documented.

### Should Have

- Add clear AI loading and failure states.
- Add a success message after create/update.
- Improve modal spacing and mobile controls.
- Add a short README section for AI setup, Vercel env vars, and QA steps.
- Add a manual QA checklist for create/read/update/AI/deploy verification.

### Nice to Have

- Add a "suggest family note" AI option.
- Add better empty states for filters and missing images.
- Add lightweight analytics if setup is fast.
- Add image suggestions for new recipes.

### Won't Do This Sprint

- Authentication or admin roles.
- Delete recipes.
- Dark mode.
- Social sharing.
- Full visual redesign.
- Full automated test suite beyond targeted Vitest tests and manual QA.
- Multi-user collaboration features.

## Day-by-Day Sprint Plan

### DAY 1 (Today, afternoon block, about 2 hours)

- [ ] Block 1 (~30 min): Fix the lint blocker in `RecipeFormModal`.
  - Type: Fix
  - Estimate: S
  - User story: As a developer, I can run `npm run lint` so that deployment is not blocked by a known code quality error.
  - Definition of Done: `npm run lint` no longer fails on `react-hooks/set-state-in-effect`.

- [x] Block 2 (~30 min): Add Vitest TDD baseline.
  - Type: Build
  - Estimate: S
  - User story: As a developer, I can write red/green/blue tests before changing AI or validation behavior so that sprint changes are safer.
  - Definition of Done: `npm run test:run` passes with initial validation tests.

- [ ] Block 3 (~30 min): Add OpenAI setup scaffolding.
  - Type: Build
  - Estimate: S
  - User story: As a developer, I can configure `OPENAI_API_KEY` so that the app can call OpenAI securely from the server.
  - Definition of Done: OpenAI dependency/env documentation exists, and no API key is exposed to client code.

- [ ] Block 4 (~60 min): Create the AI recipe assistant API route.
  - Type: Build
  - Estimate: M
  - User story: As a user, I can send rough recipe notes to the server so that AI can return structured recipe fields.
  - Definition of Done: A server route accepts recipe context, calls OpenAI, returns JSON shaped like `RecipeFormValues`, and handles missing API key/errors.

### DAY 2 (Full build day, about 6 hours)

#### Morning lab (~2.5 hours)

- [ ] Task 1 (~90 min): Add AI assist UI to the create/edit modal.
  - Type: Build
  - Estimate: L
  - User story: As a user, I can click an AI assist button in the recipe form so that rough notes become editable recipe fields.
  - Definition of Done: Button appears in create and edit modes, shows loading/error states, and applies AI output without losing all user-entered data unexpectedly.

- [ ] Task 2 (~60 min): Validate AI output through existing recipe validation.
  - Type: Fix
  - Estimate: M
  - User story: As a user, I get useful validation feedback if AI output is incomplete so that I can fix the recipe before saving.
  - Definition of Done: AI-generated fields run through `validateRecipeInput`, invalid results show specific errors, and valid results can be saved.

#### Afternoon lab (~2.5 hours)

- [ ] Task 3 (~60 min): Verify and fix create/update relationship saving.
  - Type: Test/Fix
  - Estimate: M
  - User story: As a user, I can save a recipe with ingredients, steps, and family notes so that the full related schema is exercised.
  - Definition of Done: Create and update both persist related records and the refreshed recipe list/detail page shows the saved changes.

- [ ] Task 4 (~60 min): Clean up high-visibility UI/text issues.
  - Type: Polish
  - Estimate: M
  - User story: As a visitor, I can browse the app without broken text or obvious layout friction so that it feels ready to present.
  - Definition of Done: Broken encoding is fixed in visible UI, README copy is readable, and the header/modal have the most obvious rough edges reduced.

- [ ] End of afternoon (~30 min): Test everything.
  - Type: Test
  - Estimate: S
  - User story: As a project owner, I know what still breaks before deploy day so that Day 3 is only bug fixes and polish.
  - Definition of Done: Manual QA is complete for home, recipe list, filters, recipe detail, create, edit, AI assist, lint, and build.

### DAY 3 (Morning only, about 3 hours -- deploy in afternoon)

- [ ] First block (~60 min): Fix bugs found during Day 2 testing.
  - Type: Fix
  - Estimate: M
  - User story: As a user, I can complete the core workflows without crashes or data loss so that the app is safe to deploy.
  - Definition of Done: All P1/P2 bugs from the QA checklist are fixed or explicitly deferred if non-blocking.

- [ ] Second block (~60 min): Apply 1 quick Should Have only if Must Haves are done.
  - Type: Polish
  - Estimate: M
  - User story: As a user, I get clearer feedback while AI/save actions run so that the app feels less confusing.
  - Definition of Done: Add either improved loading/error feedback or save confirmation, not both unless there is extra time.

- [ ] Pre-lunch (~30 min): Final cleanup.
  - Type: Test/Polish
  - Estimate: S
  - User story: As a presenter, I can demo the app without obvious typos, console logs, or mobile layout problems.
  - Definition of Done: Remove debug logs, run lint/build, quick mobile check, and verify env docs.

- [ ] Afternoon: Deploy.
  - Type: Deploy
  - Estimate: M
  - User story: As a reviewer, I can open the app from a live URL so that the project clears the deployment gate.
  - Definition of Done: Vercel deploy succeeds with `DATABASE_URL`, `DIRECT_URL`, and `OPENAI_API_KEY`; live create/read/update/AI workflows are smoke-tested.

- [ ] After deploy: Collect user evidence.
  - Type: Document
  - Estimate: S
  - User story: As a reviewer, I can see that real people used the app so that the project clears the user activity gate.
  - Definition of Done: 2-3 users try the live URL and evidence is saved as screenshots, feedback quotes, or analytics captures.

## Manual QA Checklist

- [ ] Home page loads without runtime errors.
- [ ] Recipe list page loads all recipes.
- [ ] Filters update the URL and list results.
- [ ] Recipe detail page loads ingredients, steps, and notes.
- [ ] Add recipe modal opens and closes.
- [ ] Create recipe saves a new recipe with ingredients and steps.
- [ ] Edit recipe saves changed title, ingredients, steps, and notes.
- [ ] AI assist returns useful structured data.
- [ ] AI errors are understandable when the API key is missing or the request fails.
- [ ] `npm run lint` passes.
- [x] `npm run test:run` passes.
- [ ] `npm run build` passes.
- [ ] Live Vercel URL works on desktop.
- [ ] Live Vercel URL works on mobile.

## Peer Review Notes

Use this section during Exercise 4.

### Partner Feedback Questions

- Is this realistic for 3 days?
- Is anything missing from Must Have?
- Is anything in Must Have that should move to Should Have or Nice to Have?
- Is Day 3 overloaded?
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
   - Cut to fit it: full redesign, delete recipes, auth.

2. Lint/build/deploy readiness.
   - If this is not done, the app may not deploy cleanly and cannot clear the live URL gate.
   - Cut to fit it: automated test suite, analytics setup.

3. Verified create/read/update workflow.
   - If this is not done, users cannot trust the recipe archive as a working CRUD app.
   - Cut to fit it: dark mode, social sharing, extra AI features.

Must Have I am least sure about:

- Presentation-breaking UI/text cleanup. The app technically runs without it, but obvious encoding artifacts and rough layout issues could hurt the project demo. Keep this scoped to visible problems only.

## Definition of Done

- `npm run lint` passes.
- `npm run build` passes.
- Create recipe works end-to-end.
- Read/list/detail pages work end-to-end.
- Update recipe works end-to-end.
- AI assist works for either adding a new recipe or improving an existing recipe.
- App is deployed to a live Vercel URL.
- 2-3 real users have used the deployed app and evidence is documented.

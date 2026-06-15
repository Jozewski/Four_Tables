# Four Tables UI/UX and TDD Plan

## Purpose

Tomorrow's sprint should not start with vague visual changes or untested AI code. This plan defines the recipe-site UX target and the testing workflow we will follow before changing core behavior.

## Recipe-Site UX Patterns To Borrow

Popular recipe products converge on a few practical patterns:

- Browsing is organized by meal type, ingredient, occasion, and cuisine. Allrecipes uses large navigation groups for dinners, meals, ingredients, occasions, cuisines, and kitchen tips.
- Saving and organizing recipes is treated as a core workflow. MyRecipes emphasizes saving recipes with a heart action and sorting them into collections like Keepers, Want to Try, and Weeknight Ideas.
- Recipe trust comes from complete, ordered ingredients and clear repeatable instructions. Allrecipes describes editorial review around ingredient completeness, measurement accuracy, ordering, and replicable instructions.
- Community feedback matters, but it can be scoped. Allrecipes recently added threaded recipe reviews so cooks can ask questions, leave tips, and respond to other cooks.
- Meal planning and quick rediscovery matter. EatingWell describes saved collections as a way to plan meals and quickly scan recipes users want to make again.

Sources:

- Allrecipes About: https://www.allrecipes.com/about-us-6648102
- Allrecipes MyRecipes: https://www.allrecipes.com/meet-myrecipes-11685062
- Serious Eats MyRecipes update: https://www.seriouseats.com/myrecipes-new-features-2025-11872267
- EatingWell MyRecipes: https://www.eatingwell.com/you-can-now-save-recipes-on-eatingwell-8713764
- Allrecipes threaded reviews: https://www.allrecipes.com/allrecipes-introducing-threaded-reviews-11830601

## Recommended UI/UX Direction

### Must Improve During Sprint

1. Make browsing feel like a recipe site, not a portfolio page.
   - Replace the oversized explanatory home sections with tighter recipe-first sections.
   - Keep quick filters for family, holiday, course, and prep time visible.
   - Make recipe cards/list items scannable: image, title, culture, course, prep time, ingredient count, step count.

2. Make the recipe detail page cook-friendly.
   - Put the recipe title, hero image, metadata, ingredients, and steps in a predictable layout.
   - Add a small action row near the top: Edit, AI improve, Print browser action if simple, and Back to recipes.
   - Keep ingredients and steps readable without requiring too many tab switches.

3. Make add/edit feel guided.
   - Put AI assist at the top of the form as a clear helper, not a hidden feature.
   - Use a rough-notes textarea: "Paste family notes or recipe memory."
   - Let AI fill structured fields, then let the user edit before saving.
   - Show validation errors near the relevant section where possible.

4. Remove presentation-breaking roughness.
   - Fix mojibake/encoding artifacts.
   - Reduce header height.
   - Reduce nested-card feel where it makes pages heavy.
   - Keep color palette warmer and editorial, but avoid making everything orange/brown.

### Should Improve If Time Allows

- Add save/keeper affordance visually, even if it is local-only or deferred.
- Add "family notes" as the community/trust equivalent instead of building full reviews.
- Add empty states that suggest the next action.
- Add a clear "recently added" section after create/update.

### Won't Improve This Sprint

- User accounts.
- Real saved collections.
- Reviews/comments.
- Nutrition labels.
- Grocery lists.
- Meal planning calendar.
- Full design system rewrite.

## TDD Policy

We will use Red, Green, Blue for all sprint changes that touch validation, AI data shaping, API behavior, or non-trivial UI state.

- Red: write or update a failing test that describes the expected behavior.
- Green: write the smallest implementation that makes the test pass.
- Blue: refactor, improve naming, clean UI, or reduce duplication while keeping tests green.

If a change is pure CSS polish, it does not need a unit test, but it still needs manual QA and screenshots.

## Test Stack

Current setup:

- Vitest installed for unit/component tests.
- React Testing Library installed for client component behavior.
- `npm run test` runs Vitest in watch mode.
- `npm run test:run` runs Vitest once.
- `npm run check` runs lint, test, and build.

Next 16 local testing guidance used:

- `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`
- `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`
- `node_modules/next/dist/docs/01-app/02-guides/testing/index.md`

Important constraint:

- Next's local docs recommend E2E testing for async Server Components. Use Vitest for isolated functions/client behavior, and use manual QA or Playwright later for full browser flows.

## First Tests To Write Tomorrow

### AI Recipe Assistant

- Red: AI output missing ingredients is rejected.
- Green: API/normalizer returns validation errors instead of saving bad data.
- Blue: Extract AI response normalization into a small function.

### Recipe Create/Update

- Red: update payload with two ingredients and two steps preserves ordering.
- Green: route/update helper saves relationship order correctly.
- Blue: remove duplication between create and update mapping if it stays readable.

### Modal UX

- Red: clicking AI assist shows loading state and disables duplicate submissions.
- Green: add loading state.
- Blue: simplify state names and error display.

### Validation

- Red: invalid OpenAI image URL or unsupported category returns a clear error.
- Green: validation catches it.
- Blue: group validation messages by section if time allows.

## Manual UX Acceptance Criteria

- A first-time visitor can understand what the app is within 5 seconds.
- A visitor can reach the recipe list from the first viewport.
- A visitor can scan recipes by family, holiday, and course without reading paragraphs.
- A user can add a recipe from rough notes using AI, edit the fields, and save.
- A user can update an existing recipe and see changes after refresh.
- A recipe detail page is usable while cooking: ingredients and steps are easy to read.
- No visible broken text encoding remains on primary pages.

## Tomorrow's First TDD Loop

1. Run `npm run test:run` to confirm baseline tests pass.
2. Pick the AI response normalization behavior.
3. Write a failing test for malformed AI output.
4. Implement the smallest normalizer/API behavior to pass.
5. Refactor only after tests pass.
6. Run `npm run check` before calling the task done.

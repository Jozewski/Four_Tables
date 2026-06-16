# TDD Summary

This document tracks the red/green/blue testing work used during the Four Tables sprint. It should be updated each time a feature is built through TDD.

## TDD Method

- :x: Red: write a failing test that describes the expected behavior.
- :white_check_mark: Green: implement the smallest change that makes the test pass.
- :large_blue_circle: Blue: refactor or clean up while keeping tests green.

## Current Test Commands

```bash
npm run test:run
npm run check
```

`npm run check` runs lint, Vitest, and the production build.

## Required Test Environment

Local and deployed AI assist requires these environment variables:

```text
DATABASE_URL
DIRECT_URL
OPENAI_API_KEY
OPENAI_MODEL
```

`OPENAI_MODEL` is optional in code because the route defaults to `gpt-4.1-mini`, but it is included in `.env.example` so the intended model is explicit. If `OPENAI_API_KEY` is missing, the AI route intentionally returns `OPENAI_API_KEY is not configured.`

## Current Test Suite

The current Vitest suite has 8 test files and 19 total tests.

### `__tests__/recipeValidation.test.ts`

Suite: `recipe input validation`

1. `accepts a complete recipe with related ingredients, steps, and notes`
   - Proves a valid manual recipe payload passes validation.
   - Confirms `prepTime` is normalized from string to number.
   - Confirms empty `holiday` becomes `null`.
   - Confirms related `ingredients`, `steps`, and `notes` are preserved.

2. `rejects missing required relationship data`
   - Proves recipes without ingredients are rejected.
   - Proves recipes without steps are rejected.
   - Confirms validation messages include:
     - `At least one ingredient is required.`
     - `At least one step is required.`

3. `normalizes empty optional fields to null`
   - Proves whitespace is trimmed from title input.
   - Confirms empty `description`, `holiday`, `prepTime`, `imageUrl`, and ingredient `unit` normalize to `null`.

### `__tests__/aiRecipeAssist.test.ts`

Suite: `AI recipe assist output normalization`

1. `rejects malformed AI output with no ingredients`
   - Proves AI output is rejected when it lacks required ingredient data.
   - Confirms AI output uses the same relationship guardrail as manual recipe input.

2. `returns normalized form values for valid AI output`
   - Proves valid AI output becomes editable `RecipeFormValues`.
   - Confirms numeric AI values like `prepTime` and ingredient `amount` are converted to strings for the form.
   - Confirms whitespace is trimmed.
   - Confirms ingredients, steps, and notes are preserved in form-ready shape.

3. `fills unspecified AI ingredient amounts with as needed`
   - Proves AI output with a named ingredient but blank amount is repaired instead of rejected.
   - Confirms unspecified amounts become `as needed`.
   - Covers the bruschetta failure where OpenAI generated extra ingredients without amounts.

### `__tests__/RecipeFormModal.ai.test.tsx`

Suite: `RecipeFormModal AI assist`

1. `sends rough notes to AI assist and applies returned values to editable fields`
   - Proves the modal exposes an AI notes field.
   - Proves the modal calls `POST /api/recipes/assist`.
   - Proves returned AI values populate editable recipe form fields.

2. `shows AI assist errors returned by the server`
   - Proves the modal displays server-returned AI errors.
   - Proves rough notes remain in the textarea after an AI failure.

### `__tests__/images.test.ts`

Suite: `recipe image helpers`

1. `allows next/image for configured recipe image hosts`
   - Proves configured image hosts can still use Next image optimization.

2. `does not use next/image for unknown user-submitted image hosts`
   - Proves unknown external image URLs remain valid recipe images.
   - Proves unknown hosts avoid the Next `next/image` configured-host runtime crash.

### `__tests__/recipeImageUpload.test.ts`

Suite: `recipe image uploads`

1. `accepts image data URLs as recipe image input`
   - Proves uploaded image values can be saved through the existing recipe `imageUrl` field.
   - Confirms the validation layer accepts `data:image/...` values produced by the upload route.

2. `rejects non-image uploads`
   - Proves text files and other non-image uploads are rejected before they can be saved.
   - Confirms the user-facing error explains the accepted image formats.

### `__tests__/ThemeToggle.test.tsx`

Suite: `ThemeToggle`

1. `toggles the document theme and persists the choice`
   - Proves the theme button switches the app between light and dark mode.
   - Confirms the selected theme is stored in `localStorage`.
   - Confirms the document `data-theme` attribute changes so CSS variables can style the app.

### `__tests__/recipeDeleteRoute.test.ts`

Suite: `DELETE /api/recipes/[id]`

1. `rejects invalid recipe ids`
   - Proves invalid route params return a `400` response.
   - Confirms no delete call is attempted for invalid IDs.

2. `returns 404 when the recipe does not exist`
   - Proves missing recipes return a `404` response.
   - Confirms no delete call is attempted for missing recipes.

3. `deletes related records before deleting the recipe`
   - Proves ingredients, steps, and family notes are deleted before the recipe row.
   - Confirms the work is wrapped in a Prisma transaction.

### `__tests__/DeleteRecipeButton.test.tsx`

Suite: `DeleteRecipeButton`

1. `does not delete when confirmation is cancelled`
   - Proves the UI requires confirmation before delete.
   - Confirms cancelling does not call the API or refresh the page.

2. `deletes after confirmation and refreshes the current page`
   - Proves the UI calls `DELETE /api/recipes/:id`.
   - Confirms the page refreshes after a successful delete.

## TDD Log

### 2026-06-14: Recipe Input Validation Baseline

Goal:

- Establish baseline validation coverage before changing create/update or AI behavior.

:x: Red:

- Added `__tests__/recipeValidation.test.ts`.
- Wrote tests for:
  - accepting a complete recipe with ingredients, steps, and notes
  - rejecting missing ingredients and steps
  - normalizing empty optional fields
- First red run:

```bash
npm run test:run
```

- First failure to capture next time: this baseline was created before the project started tracking TDD evidence in this document, so the original terminal failure output was not preserved.

:white_check_mark: Green:

- Confirmed existing `lib/recipeValidation.ts` behavior satisfied the baseline tests.
- The tests established guardrails for future API and AI work.

:large_blue_circle: Blue:

- Kept validation logic centralized in `lib/recipeValidation.ts`.
- No separate route-specific validation was introduced.

Verification:

```bash
npm run test:run
```

Result:

- Baseline validation tests passed.

### 2026-06-15: AI Recipe Output Normalization

Goal:

- Validate AI-generated recipe data before it can be applied to the add/edit recipe form.

:x: Red:

- Added `__tests__/aiRecipeAssist.test.ts`.
- Wrote failing tests for:
  - malformed AI output with no ingredients
  - valid AI output becoming normalized `RecipeFormValues`
- Initial failure proved the production helper did not exist yet:
  - missing module: `@/lib/aiRecipeAssist`
- First red run:

```bash
npm run test:run -- __tests__/aiRecipeAssist.test.ts
```

- First failure output:

```text
FAIL  __tests__/aiRecipeAssist.test.ts
Error: Failed to resolve import "@/lib/aiRecipeAssist" from "__tests__/aiRecipeAssist.test.ts".
Does the file exist?
```

:white_check_mark: Green:

- Added `lib/aiRecipeAssist.ts`.
- Implemented `normalizeAiRecipeOutput`.
- Routed AI output through existing `validateRecipeInput`.
- Confirmed the targeted test passed:

```bash
npm run test:run -- __tests__/aiRecipeAssist.test.ts
```

Result:

- 1 test file passed.
- 2 tests passed.

:large_blue_circle: Blue:

- Kept normalization isolated from the API route so it can be tested without calling OpenAI.
- Reused existing recipe validation instead of creating separate AI-only validation rules.
- Added server route after the helper was green:
  - `app/api/recipes/assist/route.ts`

Final verification:

```bash
npm run check
```

Result:

- 2 test files passed.
- 5 tests passed.
- Lint passed.
- Production build passed.

### 2026-06-15: Recipe Modal AI Assist UI

Goal:

- Add AI assist to the add/edit recipe modal so rough notes can populate editable recipe fields.

:x: Red:

- Added `__tests__/RecipeFormModal.ai.test.tsx`.
- Wrote a failing component test for:
  - typing rough notes into an AI notes field
  - calling `/api/recipes/assist`
  - applying returned values to form fields
- First red run:

```bash
npm run test:run -- __tests__/RecipeFormModal.ai.test.tsx
```

- First failure output:

```text
FAIL  __tests__/RecipeFormModal.ai.test.tsx
TestingLibraryElementError: Unable to find a label with the text of: AI recipe notes
```

:white_check_mark: Green:

- Updated `components/RecipeFormModal.tsx`.
- Added:
  - AI notes textarea
  - `Draft with AI` button
  - loading state
  - error state
  - call to `POST /api/recipes/assist`
  - form population from returned `RecipeFormValues`
- Confirmed the targeted test passed:

```bash
npm run test:run -- __tests__/RecipeFormModal.ai.test.tsx
```

Result:

- 1 test file passed.
- 1 test passed.

:large_blue_circle: Blue:

- Kept AI state local to `RecipeFormModal`.
- Reused the existing form state instead of creating a parallel AI-only form.
- Preserved user review/edit behavior before final save.
- Completed manual AI-assisted create and edit smoke tests with a real OpenAI key:
  - rough recipe notes were pasted into the AI notes field
  - AI returned structured recipe fields
  - generated fields remained editable before saving
  - the recipe saved through the normal create flow
  - an existing recipe was updated through the edit flow

Final verification:

```bash
npm run check
```

Result:

- 3 test files passed.
- 6 tests passed.
- Lint passed.
- Production build passed.

Post-blue verification:

```bash
npm run check
```

Result:

- 4 test files passed.
- 10 tests passed.
- Lint passed.
- Production build passed.

### 2026-06-15: AI Assist Error Visibility

Goal:

- Make OpenAI failures actionable in the modal instead of showing only a generic failure message.

:x: Red:

- Added a modal failure-path test in `__tests__/RecipeFormModal.ai.test.tsx`.
- Wrote coverage for:
  - server returning `{ ok: false, errors: [...] }`
  - modal showing the server error
  - rough notes staying in the AI textarea after failure

:white_check_mark: Green:

- Confirmed the modal already displayed server errors and preserved the typed notes.
- Updated `app/api/recipes/assist/route.ts` so OpenAI non-OK responses return a sanitized OpenAI error message.

:large_blue_circle: Blue:

- Kept the error extraction isolated in `getOpenAiErrorMessage`.
- Preserved the generic fallback when OpenAI does not return a structured error.

Final verification:

```bash
npm run check
```

Result:

- 3 test files passed.
- 7 tests passed.
- Lint passed.
- Production build passed.

### 2026-06-15: AI Ingredient Amount Repair

Goal:

- Prevent valid recipe drafts from failing when OpenAI returns named ingredients with blank amounts.

:x: Red:

- Updated `__tests__/aiRecipeAssist.test.ts`.
- Added coverage for a bruschetta-style AI output where `toasted crusty Italian bread` has a blank amount.
- First red run:

```bash
npm run test:run -- __tests__/aiRecipeAssist.test.ts
```

- First failure output:

```text
FAIL  __tests__/aiRecipeAssist.test.ts > AI recipe assist output normalization > fills unspecified AI ingredient amounts with as needed
AssertionError: expected false to be true
```

:white_check_mark: Green:

- Updated `lib/aiRecipeAssist.ts`.
- Added ingredient amount repair:
  - if an ingredient has a name but no amount, normalize the amount to `as needed`
- Updated `app/api/recipes/assist/route.ts` prompt/schema guidance so OpenAI is told every ingredient must have a non-empty amount.

:large_blue_circle: Blue:

- Kept manual recipe validation strict.
- Limited the repair to AI output normalization only.
- Preserved the existing rule that recipes with no ingredients are rejected.

Final verification:

```bash
npm run check
```

Result:

- 3 test files passed.
- 8 tests passed.
- Lint passed.
- Production build passed.

### 2026-06-15: User-Submitted Image Host Safety

Goal:

- Prevent recipes with user-added external image URLs from crashing when the URL host is not configured in `next.config.ts`.

:x: Red:

- Added `__tests__/images.test.ts`.
- Wrote coverage for:
  - known configured hosts using Next image optimization
  - unknown hosts such as `lolascocina.com` avoiding `next/image`
- Runtime failure that triggered the test:

```text
Invalid src prop (...) on `next/image`, hostname "lolascocina.com" is not configured under images in your `next.config.js`
```

:white_check_mark: Green:

- Added `canUseNextImage` to `lib/images.ts`.
- Added `components/RecipeImage.tsx`.
- Updated recipe list cards and recipe detail hero to use `RecipeImage`.
- Unknown user-submitted hosts now render with a standard `img` element instead of crashing.

:large_blue_circle: Blue:

- Kept `next/image` for configured trusted hosts.
- Kept fallback behavior local to one wrapper component.
- Preserved existing fallback initials when image URLs are missing or blocked.

Final verification:

```bash
npm run check
```

Result:

- 4 test files passed.
- 10 tests passed.
- Lint passed.
- Production build passed.

### 2026-06-15: Family Recipe Image Uploads

Goal:

- Let family members add recipe photos from their device while keeping the create/edit flow deployable and tested.

:x: Red:

- Added `__tests__/recipeImageUpload.test.ts`.
- Wrote failing coverage for:
  - uploaded `data:image/...` values passing recipe validation
  - non-image uploads being rejected
- First red run:

```bash
npm run test:run -- __tests__/recipeImageUpload.test.ts
```

- First failure output:

```text
FAIL  __tests__/recipeImageUpload.test.ts
Error: Failed to resolve import "@/lib/recipeImageUpload" from "__tests__/recipeImageUpload.test.ts".
Does the file exist?
```

:white_check_mark: Green:

- Added `lib/recipeImageUpload.ts`.
- Added `POST /api/recipes/images`.
- Updated `lib/recipeValidation.ts` so the recipe form can save uploaded image data URLs.
- Added a modal test proving the upload control calls `/api/recipes/images` and applies the returned image value.

:large_blue_circle: Blue:

- Used a server-side upload route instead of reading files directly into form state.
- Kept uploaded images in the existing `imageUrl` field as deployable `data:image/...` values for this sprint.
- Fixed the file input label with explicit `id`/`htmlFor` after the UI test exposed the accessibility gap.
- Completed a manual smoke test with a real dish photo:
  - uploaded a family recipe image from the add recipe modal
  - saved the recipe successfully
  - confirmed the uploaded image rendered after saving

Final verification:

```bash
npm run check
```

Result:

- 5 test files passed.
- 13 tests passed.
- Lint passed.
- Production build passed.

### 2026-06-15: Light/Dark Mode Toggle

Goal:

- Add a user-controlled light/dark mode toggle without disrupting the existing recipe-site visual system.

:x: Red:

- Added `__tests__/ThemeToggle.test.tsx`.
- Wrote failing coverage for:
  - rendering a button to switch to dark mode
  - updating `document.documentElement.dataset.theme`
  - persisting the selected theme in `localStorage`
- First red run:

```bash
npm run test:run -- __tests__/ThemeToggle.test.tsx
```

- First failure output:

```text
FAIL  __tests__/ThemeToggle.test.tsx
Error: Failed to resolve import "@/components/ThemeToggle" from "__tests__/ThemeToggle.test.tsx".
Does the file exist?
```

:white_check_mark: Green:

- Added `components/ThemeToggle.tsx`.
- Mounted the toggle in the desktop culture nav and mobile header controls.
- Confirmed the targeted test passed:

```bash
npm run test:run -- __tests__/ThemeToggle.test.tsx
```

Result:

- 1 test file passed.
- 1 test passed.

:large_blue_circle: Blue:

- Added dark-mode CSS variables under `:root[data-theme="dark"]`.
- Kept the existing light theme as the default.
- Added dark overrides for core white surfaces, modal fields, and error panels so the mode change feels intentional instead of partial.
- Added `suppressHydrationWarning` on the root HTML element because the client applies the saved theme after hydration.
- Refined the dark palette from warm brown tones to slate-based surfaces.
- Replaced the first compact text toggle with a clearer SVG sun/moon switch CTA.
- Added recipe index card and snapshot dark-mode overrides so text remains readable in dark mode.
- Used Playwright screenshots to verify dark-mode contrast on the recipe index and home page:
  - `screenshots/ui-audit/dark-recipes-desktop-viewport.png`
  - `screenshots/ui-audit/dark-recipes-mobile-viewport.png`
  - `screenshots/ui-audit/dark-home-desktop-viewport.png`

Final verification:

```bash
npm run check
```

Result:

- 6 test files passed.
- 14 tests passed.
- Lint passed.
- Production build passed.

## Next TDD Entries

## Additional QA Notes

### 2026-06-15: Archive Recipes

Goal:

- Let users hide test, duplicate, or unwanted recipes without permanently deleting family data.

:x: Red:

- Added `__tests__/recipeDeleteRoute.test.ts`.
- Wrote failing coverage for:
  - invalid IDs returning `400`
  - missing recipes returning `404`
  - related records being deleted before the recipe
- First red run:

```bash
npm run test:run -- __tests__/recipeDeleteRoute.test.ts
```

- First failure output:

```text
TypeError: DELETE is not a function
```

- Added `__tests__/DeleteRecipeButton.test.tsx`.
- Wrote failing coverage for:
  - cancelling confirmation prevents deletion
  - confirming deletion calls the API and refreshes the page
- First UI red run:

```bash
npm run test:run -- __tests__/DeleteRecipeButton.test.tsx
```

- First UI failure output:

```text
Error: Failed to resolve import "@/components/DeleteRecipeButton"
```

- Added `__tests__/recipeArchiveRoute.test.ts`.
- Wrote failing coverage for:
  - invalid IDs returning `400`
  - missing recipes returning `404`
  - archiving a recipe by setting `archivedAt`
- First archive route red run:

```bash
npm run test:run -- __tests__/recipeArchiveRoute.test.ts __tests__/ArchiveRecipeButton.test.tsx
```

- First archive failure output:

```text
Error: Failed to resolve import "@/app/api/recipes/[id]/archive/route"
Error: Failed to resolve import "@/components/ArchiveRecipeButton"
```

:white_check_mark: Green:

- Added `DELETE` to `app/api/recipes/[id]/route.ts`.
- Added `components/DeleteRecipeButton.tsx`.
- Added the delete button to recipe index cards.
- Added `archivedAt` to the Prisma `Recipe` model.
- Added `PATCH /api/recipes/[id]/archive`.
- Added `components/ArchiveRecipeButton.tsx` with a confirmation modal.
- Updated the recipe index so normal browsing hides archived recipes and the `Archived` view shows them.
- Confirmed the focused delete suites passed:

```bash
npm run test:run -- __tests__/recipeDeleteRoute.test.ts __tests__/DeleteRecipeButton.test.tsx
```

Result:

- 2 test files passed.
- 5 tests passed.

- Confirmed the focused archive suites passed:

```bash
npm run test:run -- __tests__/recipeArchiveRoute.test.ts __tests__/ArchiveRecipeButton.test.tsx
```

Result:

- 2 test files passed.
- 5 tests passed.

:large_blue_circle: Blue:

- Kept related-record cleanup in one API transaction.
- Kept delete confirmation in a focused client component instead of expanding the recipe card component state.
- Replaced the destructive UI action with a safer archive flow.
- Kept hard delete API coverage available, but the recipe index now exposes archive as the user-facing action.
- Ran `npx prisma generate` and `npx prisma db push`; Neon confirmed the database is in sync with the new nullable `archivedAt` column.
- Manual smoke test completed successfully after restarting the dev server.

Final verification:

```bash
npm run check
```

Result:

- 8 test files passed.
- 19 tests passed.
- Lint passed.
- Production build passed.

### 2026-06-15: Theme Toggle Hydration Fix

- Fixed a React hydration mismatch where the server rendered the theme toggle as light, but the client rendered it as dark on first render when `localStorage` contained a saved dark preference.
- Replaced client-first `useState(localStorage)` initialization with `useSyncExternalStore`, using a server-safe light snapshot for hydration and reading saved theme state after hydration.
- Made the toggle button markup theme-neutral (`className`, `aria-label`, and `title` no longer change between light and dark) and moved the visual state to CSS selectors based on `html[data-theme]`.
- Verified with:

```bash
npm run check
```

Result:

- 10 test files passed.
- 24 tests passed.
- Lint passed.
- Production build passed.

### 2026-06-15: Recipe Index Alphabetical Ordering

- Changed the recipe index query so `All Recipes` sorts by recipe `title` instead of grouping by `cultural` first.
- Verified with:

```bash
npm run check
```

Result:

- 6 test files passed.
- 14 tests passed.
- Lint passed.
- Production build passed.

Use this template for future sprint work.

### YYYY-MM-DD: Feature Name

Goal:

- What behavior are we proving?

:x: Red:

- What failing test was written?
- What did the failure prove?

:white_check_mark: Green:

- What minimal implementation made the test pass?
- What command confirmed it?

:large_blue_circle: Blue:

- What cleanup or refactor happened after tests passed?

Final verification:

```bash
npm run check
```

Result:

- Record test/build result here.

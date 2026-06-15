# TDD Summary

This document tracks the red/green/blue testing work used during the Four Tables sprint. It should be updated each time a feature is built through TDD.

## TDD Method

- ❌ Red: write a failing test that describes the expected behavior.
- ✅ Green: implement the smallest change that makes the test pass.
- 🔵 Blue: refactor or clean up while keeping tests green.

## Current Test Commands

```bash
npm run test:run
npm run check
```

`npm run check` runs lint, Vitest, and the production build.

## Current Test Suite

The current Vitest suite has 2 test files and 5 total tests.

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
   - Confirms the validation messages include:
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

## TDD Log

### 2026-06-14: Recipe Input Validation Baseline

Goal:

- Establish baseline validation coverage before changing create/update or AI behavior.

❌ Red:

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

✅ Green:

- Confirmed existing `lib/recipeValidation.ts` behavior satisfied the baseline tests.
- The tests established guardrails for future API and AI work.

🔵 Blue:

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

❌ Red:

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

✅ Green:

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

🔵 Blue:

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

## Next TDD Entries

Use this template for future sprint work.

### YYYY-MM-DD: Feature Name

Goal:

- What behavior are we proving?

❌ Red:

- What failing test was written?
- What did the failure prove?

✅ Green:

- What minimal implementation made the test pass?
- What command confirmed it?

🔵 Blue:

- What cleanup or refactor happened after tests passed?

Final verification:

```bash
npm run check
```

Result:

- Record test/build result here.

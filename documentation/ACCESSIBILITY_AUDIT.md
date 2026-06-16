# Accessibility Audit

## Scope

This document records the accessibility work completed for the WCAG compliance sprint on `feature/wcag-aa-accessibility`.

Target:

- WCAG 2.1 / 2.2 Level AA

Primary surfaces tested:

- Home page
- Recipes index
- Contributor access page
- Signed-in contributor recipes page
- Add Recipe modal

## Tools Used

- Playwright
- `@axe-core/playwright`
- Vitest
- `axe-core`
- Manual browser review

## Automated Test Coverage

### Browser-Level Accessibility Checks

Command:

```bash
npm run test:a11y
```

Covered in [tests/accessibility.spec.ts](/C:/Users/joann/Desktop/four-tables/tests/accessibility.spec.ts):

- Home page has no detectable WCAG A/AA violations
- Recipes index has no detectable WCAG A/AA violations
- Contributor page has no detectable WCAG A/AA violations
- Signed-in contributor recipes page has no detectable WCAG A/AA violations

### Component-Level Accessibility Check

Command:

```bash
npm run test:run -- __tests__/RecipeFormModal.accessibility.test.tsx
```

Covered in [__tests__/RecipeFormModal.accessibility.test.tsx](/C:/Users/joann/Desktop/four-tables/__tests__/RecipeFormModal.accessibility.test.tsx):

- Open add-recipe dialog has no detectable WCAG A/AA violations

## Issues Found

### 1. Insufficient Color Contrast

Affected areas:

- Accent-colored text and buttons
- Muted text combinations
- Category chip color combinations

Impact:

- Several UI combinations did not meet Level AA contrast requirements.

Fix:

- Adjusted light-theme color tokens in [app/globals.css](/C:/Users/joann/Desktop/four-tables/app/globals.css)
- Darkened accent and category tones
- Strengthened muted text color for better readability

### 2. Contributor CTA Text Color

Affected area:

- `Contributor Sign In` call to action on the recipes page

Impact:

- The intended white CTA text could be overridden by inherited link styling, reducing clarity.

Fix:

- Explicitly preserved white CTA text in [app/recipes/page.tsx](/C:/Users/joann/Desktop/four-tables/app/recipes/page.tsx)

### 3. Test Runner Boundary

Affected area:

- Full test suite execution

Impact:

- Vitest attempted to execute the Playwright accessibility spec, causing runner errors.

Fix:

- Excluded `tests/**` from Vitest in [vitest.config.mts](/C:/Users/joann/Desktop/four-tables/vitest.config.mts)

## Manual Review Notes

Manual review during this pass identified one UX cleanup related to contributor controls:

- Removed the redundant `Log Out` CTA from the contributor access card
- Kept the single global `Log Out` control in the header as the canonical sign-out action

Implementation:

- [app/contributor/page.tsx](/C:/Users/joann/Desktop/four-tables/app/contributor/page.tsx)

Manual screen-reader evidence is recorded in [SCREEN_READER_QA.md](./SCREEN_READER_QA.md).

## Verification

Commands run successfully:

```bash
npm run lint
npm run test:run
npm run test:a11y
```

Result:

- Lint passed
- Vitest passed
- Playwright accessibility suite passed

## Remaining Manual Checks Before Deploy

- Focus visibility review in both light and dark modes
- Mobile accessibility smoke test
- Live deployed accessibility smoke test on Vercel

## Conclusion

The project now has automated accessibility coverage for the main public and contributor-facing flows, with current checks targeting WCAG 2.1 / 2.2 Level AA at both the page and modal levels.

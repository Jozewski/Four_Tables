# Four Tables Requirements And TDD Plan

## Project Overview

Four Tables is a family recipe archive for preserving traditional recipes from four cultural traditions: Italian, Dutch, German, and Mexican. The app lets users browse recipes, view full recipe details, create new recipes, and update existing recipes.

The current sprint adds an OpenAI-powered recipe assistant that helps turn rough family notes into structured recipe fields. The app will be deployed to Vercel on Saturday, June 20, and demoed on Monday, June 22.

## Target Users

- Family members who want to preserve recipes from relatives.
- Home cooks looking for traditional holiday recipes.
- Users converting handwritten or informal recipe notes into structured digital recipes.
- Reviewers evaluating schema relationships, CRUD behavior, AI usage, deployment, and user activity evidence.

## Core Purpose

The purpose of Four Tables is to make family recipes easier to preserve, organize, browse, and improve without losing the personal family context behind each dish.

## User Stories

### Browse Recipes

As a visitor, I can browse recipes by cultural tradition, holiday, and category so that I can find recipes that match the meal or occasion I care about.

Acceptance criteria:

- Recipe list page loads without runtime errors.
- Filters update the visible recipe list.
- Filter choices are reflected in the URL.
- Recipe cards show title, image or fallback styling, cultural tradition, holiday, category, prep time, ingredient count, and step count.
- Empty or narrow filter results do not crash the page.

### Read Recipe Details

As a visitor, I can open a recipe detail page so that I can cook from complete ingredients, ordered steps, and family notes.

Acceptance criteria:

- Clicking a recipe opens the correct detail page.
- Detail page shows title, description, cultural tradition, holiday, category, prep time, image, ingredients, steps, and family notes.
- Ingredients remain in stored order.
- Steps remain in stored order.
- Missing optional fields do not create broken UI.

### Create A Recipe

As a user, I can add a new recipe so that the recipe archive can grow over time.

Acceptance criteria:

- Add recipe modal opens and closes.
- Required fields are validated before save.
- User can add ingredients and steps.
- Saving creates a new `Recipe` with related `Ingredient` and `Step` records.
- Created recipe appears in the recipe list and has a working detail page.
- Invalid submissions show useful errors and do not create partial data.

### Update A Recipe

As a user, I can edit an existing recipe so that family recipes can be corrected or improved.

Acceptance criteria:

- Edit action opens the existing recipe data in the form.
- User can change title, description, tradition, holiday, category, prep time, image URL, ingredients, steps, and notes.
- Saving persists the updates.
- Updated recipe detail page shows the new values after refresh.
- Reordered or replaced ingredients and steps remain correctly ordered.

### Use AI Recipe Assist

As a user, I can paste rough family recipe notes into an AI assistant so that the app can draft structured recipe fields for me.

Acceptance criteria:

- AI assist is available from the add/edit recipe modal.
- User can enter rough notes before calling AI.
- The OpenAI API is called only from a server route.
- `OPENAI_API_KEY` is never exposed to client code.
- AI output is validated before it is applied to the form.
- User can edit AI-filled fields before saving.
- Missing API key, failed API calls, or malformed AI output show clear errors.

### Deploy And Collect Evidence

As a reviewer, I can open the app at a live URL and see evidence that real users tried it.

Acceptance criteria:

- Vercel deployment succeeds by Saturday, June 20.
- Production has `DATABASE_URL`, `DIRECT_URL`, and `OPENAI_API_KEY` configured.
- Live URL passes smoke tests for browse, read, create, update, and AI assist.
- Evidence from 2-3 real users is documented before the Monday, June 22 demo.

## Specifications

### Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL hosted with Neon
- OpenAI API
- Vitest
- React Testing Library
- Playwright for screenshot and browser QA support
- Vercel deployment

### Data Model

Primary entity:

- `Recipe`

Related entities:

- `Ingredient`
- `Step`
- `FamilyNote`

Relationship requirements:

- One `Recipe` has many `Ingredient` records.
- One `Recipe` has many `Step` records.
- One `Recipe` has many `FamilyNote` records.
- Ingredient order is stored with `order`.
- Step order is stored with `stepNumber`.

### API Specifications

Existing routes:

- `POST /api/recipes`
  - Creates one recipe with related ingredients, steps, and notes.
  - Validates payload through `validateRecipeInput`.

- `PUT /api/recipes/[id]`
  - Updates one recipe.
  - Replaces related ingredients, steps, and notes with validated submitted data.

Planned route:

- `POST /api/recipes/assist`
  - Accepts rough notes and optional existing recipe context.
  - Calls OpenAI from the server.
  - Returns structured recipe form data.
  - Handles missing API key, invalid request body, failed model calls, and malformed model responses.

### AI Output Shape

The AI assistant should return data compatible with the existing recipe form:

```ts
type RecipeFormValues = {
  title: string;
  description: string;
  cultural: string;
  holiday: string;
  category: string;
  prepTime: string;
  imageUrl: string;
  ingredients: Array<{ amount: string; unit: string; name: string }>;
  steps: Array<{ instruction: string }>;
  notes: Array<{ author: string; content: string }>;
};
```

Supported controlled values:

- Cultural traditions: Italian, Dutch, German, Mexican
- Holidays: Christmas, Easter, Thanksgiving, or empty
- Categories: Main, Dessert, Bread, Soup, Side, Seafood, Appetizer

### UI Specifications

- The app should visually feel like a modern recipe site.
- Browsing should prioritize recipe cards, filters, and readable metadata.
- Add/edit modal should feel guided, not like raw database entry.
- AI assist should be visible near the top of the recipe form.
- Users must review AI output before saving.
- Mobile layout must remain usable for browse, detail, and add/edit workflows.

### Deployment Specifications

Required Vercel environment variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `OPENAI_API_KEY`

Final verification command:

```bash
npm run check
```

## Prompts For Writing Tests

Use these prompts when asking an AI coding assistant to help write tests. Follow red/green/blue: write the failing test first, implement the smallest fix, then refactor.

### Prompt 1: AI Output Normalization Test

```text
I am building a Next.js 16 + TypeScript recipe app called Four Tables.

I need a Vitest test for AI recipe output normalization.

Context:
- The app uses RecipeFormValues from lib/recipeValidation.ts.
- AI output must include title, cultural, category, ingredients, and steps.
- Supported cultures are Italian, Dutch, German, and Mexican.
- Supported categories are Main, Dessert, Bread, Soup, Side, Seafood, and Appetizer.

Write a failing test first for this behavior:
- malformed AI output with no ingredients is rejected with a useful error
- valid AI output returns normalized RecipeFormValues

Do not implement production code yet. Only write the test.
```

### Prompt 2: AI Assist API Route Test

```text
I need tests for POST /api/recipes/assist in a Next.js App Router project.

Expected behavior:
- returns 400 when rough notes are missing
- returns 500 or a clear failure response when OPENAI_API_KEY is missing
- returns structured recipe data when OpenAI returns valid JSON
- returns a validation error when OpenAI returns unsupported category or culture

Use Vitest where practical. Mock OpenAI instead of calling the real API.
Keep the test focused on behavior, not implementation details.
```

### Prompt 3: Recipe Validation Regression Test

```text
Write Vitest regression tests for validateRecipeInput in lib/recipeValidation.ts.

Cover:
- valid recipe with ingredients and steps passes
- missing title fails
- missing ingredients fails
- missing steps fails
- invalid image URL fails
- unsupported culture fails
- unsupported category fails

Keep tests readable and use small helper objects to reduce duplication.
```

### Prompt 4: Modal AI UX Test

```text
I need a React Testing Library test for RecipeFormModal.

Behavior to test:
- user can type rough notes into the AI assist textarea
- clicking the AI assist button shows a loading state
- duplicate AI submissions are prevented while loading
- successful AI output populates editable form fields
- failed AI request shows a visible error message

Mock fetch. Do not call the real API.
```

### Prompt 5: Create/Update Relationship Test

```text
I need a test or test plan for recipe create/update relationship ordering.

Behavior:
- creating a recipe with two ingredients stores order 1 and 2
- creating a recipe with two steps stores stepNumber 1 and 2
- updating a recipe replaces old ingredients and steps
- updated ingredients and steps appear in the new submitted order

If full route testing is too heavy, suggest extracting a mapping helper and testing that helper with Vitest.
```

## TDD Plan

### Red

- Write a failing test for one behavior before implementing it.
- Start with AI output normalization because malformed AI responses are the riskiest path.
- Keep the test small and specific.

### Green

- Implement the smallest code path that makes the test pass.
- Do not add extra features while getting the test green.
- Reuse `validateRecipeInput` so AI output follows the same rules as manual form submissions.

### Blue

- Refactor names, helper functions, and duplicated mapping only after tests pass.
- Keep public behavior unchanged.
- Run the full check before calling the task complete.

```bash
npm run check
```

## Manual QA Plan

- Home page loads.
- Recipe list loads.
- Filters work and update the URL.
- Recipe detail page shows relationships.
- Add recipe modal opens.
- Create recipe works.
- Edit recipe works.
- AI assist accepts rough notes.
- AI assist fills editable fields.
- AI failures show clear messages.
- Production build passes.
- Live Vercel URL works on desktop and mobile.

## Sprint Deliverables

- OpenAI assistant API route.
- AI assist UI in add/edit modal.
- TDD coverage for AI output handling.
- Updated documentation for env vars and deployment.
- Vercel live URL.
- User evidence from 2-3 real users.

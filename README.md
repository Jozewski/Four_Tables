# Four Tables

A family heritage recipe collection: traditional holiday dishes from four cultural traditions brought together in one app.

**Italian** - Grandma Louise - Naples  
**Dutch** - Oma - Amsterdam  
**German** - Father's family  
**Mexican** - Tia Carmen & Abuela Rosa

## Tech Stack

- **Next.js 16** - App Router
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **PostgreSQL** via [Neon](https://neon.tech)
- **OpenAI API** for AI-assisted recipe drafting
- **Vitest** for targeted TDD checks

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/four-tables.git
cd four-tables
npm install
```

### 2. Set up the database

Create a free account at [neon.tech](https://neon.tech), create a project, then copy both connection strings from Neon:

- Pooled connection string (Connection pooling ON) for `DATABASE_URL`
- Direct connection string (Connection pooling OFF) for `DIRECT_URL`

```bash
cp .env.example .env
# Paste pooled URL as DATABASE_URL
# Paste direct URL as DIRECT_URL
# Paste your OpenAI API key as OPENAI_API_KEY
# Set a shared contributor invite code as CONTRIBUTOR_INVITE_CODE
# Set a long random signing secret as AUTH_SECRET
```

Optional:

- `OPENAI_MODEL` defaults to `gpt-4.1-mini` if it is not set.

Required environment variables for local development and Vercel:

```text
DATABASE_URL
DIRECT_URL
OPENAI_API_KEY
OPENAI_MODEL
CONTRIBUTOR_INVITE_CODE
AUTH_SECRET
```

Public visitors can browse and read recipes. Invited contributors sign in at `/contributor`
with `CONTRIBUTOR_INVITE_CODE` before adding, editing, archiving, uploading images, or using
AI assist.

### 3. Push the schema and seed

```bash
npx prisma db push
npx prisma db seed
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

## Test and Quality Commands

```bash
npm run lint
npm run test:run
npm run build
npm run check
```

## Project Structure

```text
four-tables/
  prisma/
    schema.prisma     Data models: Recipe, Ingredient, Step, FamilyNote
    seed.js           Seed recipes across 4 traditions
  app/
    layout.tsx        Root layout with compact recipe navigation
    page.tsx          Home page
    globals.css       Design system and CSS variables
    recipes/
      page.tsx        Browse and filter recipes
      [id]/
        page.tsx      Full recipe detail with ingredients, steps, notes
  components/
    RecipeCard.tsx
    FilterBar.tsx
    RecipeDetail.tsx
    RecipeInlineListItem.tsx
    RecipeFormModal.tsx
  lib/
    prisma.ts
    recipeValidation.ts
```

## Data Model

```text
Recipe
  - Ingredient[]   ordered list
  - Step[]         ordered by stepNumber
  - FamilyNote[]   quotes from family members
```

## Recipes Included

| Title | Cultural | Holiday |
|---|---|---|
| Grandma Louise's Homemade Pasta Dough | Italian | Christmas |
| Lasagna al Forno | Italian | Easter |
| Stuffed Artichokes | Italian | Thanksgiving |
| Erwtensoep (Split Pea Soup) | Dutch | Christmas |
| Paasstol (Easter Bread) | Dutch | Easter |
| Stamppot Boerenkool | Dutch | Thanksgiving |
| Weihnachtsgans (Christmas Goose) | German | Christmas |
| Osterlamm (Easter Lamb Cake) | German | Easter |
| Sauerbraten with Gingersnap Gravy | German | Thanksgiving |
| Bacalao a la Vizcaina | Mexican | Christmas |
| Capirotada (Easter Bread Pudding) | Mexican | Easter |
| Mole Negro Turkey | Mexican | Thanksgiving |

# Four Tables

A family heritage recipe collection — traditional holiday dishes from four cultural traditions brought together in one app.

**Italian** · Grandma Louise · Naples  
**Dutch** · Oma · Amsterdam  
**German** · Father's family  
**Mexican** · Tía Carmen & Abuela Rosa  

## Tech Stack

- **Next.js 16** — App Router
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **PostgreSQL** via [Neon](https://neon.tech)

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
```

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

### Prisma Studio (visual DB browser)

```bash
npx prisma studio
```

## Project Structure

```
four-tables/
├── prisma/
│   ├── schema.prisma     Data models (Recipe, Ingredient, Step, FamilyNote)
│   └── seed.js           12 complete holiday recipes across 4 traditions
├── app/
│   ├── layout.tsx        Root layout with navigation
│   ├── page.tsx          Home page — four family introductions
│   ├── globals.css       Design system + CSS variables
│   └── recipes/
│       ├── page.tsx      Browse + filter by cultural tradition and holiday
│       └── [id]/
│           └── page.tsx  Full recipe detail with ingredients, steps, notes
├── components/
│   ├── RecipeCard.tsx    Card used on browse page
│   ├── FilterBar.tsx     Cultural + holiday filter buttons (client component)
│   └── RecipeDetail.tsx  Tabbed ingredient/step/note viewer (client component)
└── lib/
    └── prisma.ts         Singleton Prisma client
```

## Data Model

```
Recipe
  ├── Ingredient[]   (ordered list)
  ├── Step[]         (ordered by stepNumber)
  └── FamilyNote[]   (quotes from family members)
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
| Bacalao a la Vizcaína | Mexican | Christmas |
| Capirotada (Easter Bread Pudding) | Mexican | Easter |
| Mole Negro Turkey | Mexican | Thanksgiving |

require("dotenv").config();
const { Client } = require("pg");

const sql = `
CREATE TABLE IF NOT EXISTS "Recipe" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "cultural" TEXT NOT NULL,
  "holiday" TEXT NOT NULL,
  "prepTime" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FamilyNote" (
  "id" SERIAL PRIMARY KEY,
  "author" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "recipeId" INTEGER NOT NULL,
  CONSTRAINT "FamilyNote_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Ingredient" (
  "id" SERIAL PRIMARY KEY,
  "order" INTEGER NOT NULL,
  "amount" TEXT NOT NULL,
  "unit" TEXT,
  "name" TEXT NOT NULL,
  "recipeId" INTEGER NOT NULL,
  CONSTRAINT "Ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Step" (
  "id" SERIAL PRIMARY KEY,
  "stepNumber" INTEGER NOT NULL,
  "instruction" TEXT NOT NULL,
  "recipeId" INTEGER NOT NULL,
  CONSTRAINT "Step_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query(sql);
  await client.end();

  console.log("Schema bootstrap complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

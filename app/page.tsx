import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";

type SweetRecipe = Awaited<ReturnType<typeof prisma.recipe.findMany>>[number];
 
const cultureColor: Record<string, string> = {
  Italian: "var(--italian)",
  Dutch:   "var(--dutch)",
  German:  "var(--german)",
  Mexican: "var(--mexican)",
};
 
export const metadata = {
  title: "All Recipes — Four Tables",
  description: "Full recipe collection from all four family traditions.",
};
 
export default async function SweetsPage() {
  const sweets = await prisma.recipe.findMany({
    orderBy: [{ cultural: "asc" }, { title: "asc" }],
    select: {
      id: true, title: true, description: true, cultural: true,
      holiday: true, category: true, prepTime: true, imageUrl: true,
      _count: { select: { ingredients: true, steps: true } },
    },
  });
 
  // Group by culture
  const grouped = sweets.reduce<Record<string, SweetRecipe[]>>((acc: Record<string, SweetRecipe[]>, r: SweetRecipe) => {
    if (!acc[r.cultural]) acc[r.cultural] = [];
    acc[r.cultural].push(r);
    return acc;
  }, {});
 
  const cultures = ["Italian", "Dutch", "German", "Mexican"];
 
  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      {/* Header */}
      <div className="text-center mb-16 fade-up">
        <p className="ornamental-rule justify-center mb-6">The Full Collection</p>
        <h1 className="font-display text-5xl font-bold text-[var(--ink)] mb-4">
          All Family Recipes
        </h1>
        <p className="font-body text-lg italic text-[var(--ink-soft)] max-w-xl mx-auto">
          Complete recipes from the Italian, Dutch, German, and Mexican tables,
          including ingredients, steps, and family notes.
        </p>
      </div>
 
      {/* Culture sections */}
      {cultures.map((culture) => {
        const recipes = grouped[culture];
        if (!recipes || recipes.length === 0) return null;
        const color = cultureColor[culture];
        return (
          <section key={culture} className="mb-16 fade-up">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1" style={{ backgroundColor: color, opacity: 0.3 }} />
              <div className="text-center">
                <Link
                  href={`/recipes?cultural=${culture}`}
                  className="font-sans-alt text-xs tracking-[0.25em] uppercase font-semibold hover:underline"
                  style={{ color }}
                >
                  {culture}
                </Link>
                <p className="font-body text-xs italic text-[var(--ink-muted)] mt-0.5">
                  {culture === "Italian"  ? "Grandma Louise"
                  : culture === "Dutch"   ? "Oma"
                  : culture === "German"  ? "Tante Brigitte"
                  : "Tía Carmen & Abuela Rosa"}
                </p>
              </div>
              <div className="h-px flex-1" style={{ backgroundColor: color, opacity: 0.3 }} />
            </div>
 
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recipes.map((recipe: SweetRecipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
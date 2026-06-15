import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/RecipeCard";
import Link from "next/link";
 
const cultureColor: Record<string, string> = {
  Italian: "var(--italian)",
  Dutch:   "var(--dutch)",
  German:  "var(--german)",
  Mexican: "var(--mexican)",
};
 
export const metadata = {
  title: "Four Tables - Home",
  description: "A browse-first recipe home for four family traditions.",
};
 
export default async function HomePage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: [{ cultural: "asc" }, { title: "asc" }],
    select: {
      id: true, title: true, description: true, cultural: true,
      holiday: true, category: true, prepTime: true, imageUrl: true,
      _count: { select: { ingredients: true, steps: true } },
    },
  });

  type Recipe = (typeof recipes)[number];

  const grouped = recipes.reduce<Record<string, Recipe[]>>((acc: Record<string, Recipe[]>, recipe: Recipe) => {
    if (!acc[recipe.cultural]) acc[recipe.cultural] = [];
    acc[recipe.cultural].push(recipe);
    return acc;
  }, {});

  const featured = recipes.slice(0, 3);
  const holidaySpotlight = recipes.filter((recipe: Recipe) => recipe.holiday).slice(0, 4);
  const dessertSpotlight = recipes.filter((recipe: Recipe) => recipe.category === "Dessert").slice(0, 4);
  const quickCategories = [
    { label: "Holiday favorites", href: "/recipes?holiday=Christmas", note: "Traditional centerpieces and sweets" },
    { label: "Desserts", href: "/recipes?category=Dessert", note: "Cookies, cakes, breads, and pastries" },
    { label: "Main dishes", href: "/recipes?category=Main", note: "Recipes that anchor the table" },
    { label: "Soups and sides", href: "/recipes?category=Soup", note: "Comfort dishes and supporting classics" },
  ];

  const cultures = ["Italian", "Dutch", "German", "Mexican"];

  const familyNotes: Record<string, string> = {
    Italian: "Rich holiday baking, seafood traditions, and comforting Sunday-table dishes.",
    Dutch: "Practical cold-weather cooking, festive breads, and hearty family staples.",
    German: "Celebration cakes, seasonal bakes, and recipes built around careful technique.",
    Mexican: "Warm spices, celebratory sweets, and deeply communal holiday cooking.",
  };

  const stats = [
    { label: "Recipes", value: String(recipes.length) },
    { label: "Traditions", value: "4" },
    { label: "Holiday collections", value: String(new Set(recipes.map((recipe: Recipe) => recipe.holiday).filter(Boolean)).size) },
  ];

  return (
    <div className="portal-shell py-10 md:py-14 space-y-14">
      <section className="fade-up">
        <div className="soft-panel rounded-[2rem] p-8 md:p-10 overflow-hidden relative">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[var(--accent-soft)] to-transparent opacity-80 pointer-events-none" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
            <p className="eyebrow mb-5">Browse four family tables</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.03em] text-[var(--ink)] max-w-3xl">
              Recipes organized like a cooking site, grounded in family tradition.
            </h1>
            <p className="font-body text-base md:text-lg text-[var(--ink-soft)] leading-8 mt-6 max-w-2xl">
              Discover complete recipes from Italian, Dutch, German, and Mexican family tables, with full ingredients, detailed steps, and the notes that explain why these dishes stayed in the family.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/recipes"
                className="rounded-full px-6 py-3 text-sm font-sans-alt font-extrabold uppercase tracking-[0.16em]"
                style={{ backgroundColor: "var(--accent)", color: "#fff" }}
              >
                Explore all recipes
              </Link>
              <Link href="/recipes?holiday=Christmas" className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-sans-alt font-extrabold uppercase tracking-[0.16em] text-[var(--ink)]">
                Holiday favorites
              </Link>
            </div>
          </div>

            <div className="grid grid-cols-3 gap-3 lg:w-[28rem]">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-center">
                  <p className="font-display text-4xl text-[var(--ink)]">{stat.value}</p>
                  <p className="mt-1 font-sans-alt text-[9px] font-extrabold uppercase tracking-[0.14em] text-[var(--ink-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="fade-up fade-up-delay-1">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow mb-3">Start browsing</p>
            <h2 className="section-heading text-[var(--ink)]">Find recipes by what you want to cook.</h2>
          </div>
          <Link href="/recipes" className="hidden md:inline-flex font-sans-alt text-sm font-extrabold uppercase tracking-[0.15em] text-[var(--accent)]">
            View full index
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {quickCategories.map((category) => (
            <Link key={category.label} href={category.href} className="section-card rounded-[1.35rem] p-5 card-lift">
              <p className="font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--accent)]">Browse</p>
              <h3 className="font-display text-2xl text-[var(--ink)] mt-2">{category.label}</h3>
              <p className="font-body text-sm text-[var(--ink-soft)] leading-6 mt-3">{category.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="fade-up fade-up-delay-2">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow mb-3">Featured recipes</p>
            <h2 className="section-heading text-[var(--ink)]">The recipes people should open first.</h2>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featured.map((recipe: Recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className="fade-up fade-up-delay-3">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="eyebrow mb-3">By tradition</p>
              <h2 className="section-heading text-[var(--ink)]">Each tradition keeps its own voice.</h2>
            </div>
          </div>

          <div className="space-y-6">
            {cultures.map((culture) => {
              const cultureRecipes = grouped[culture];
              if (!cultureRecipes?.length) return null;

              return (
                <section key={culture} className="section-card rounded-[1.5rem] p-6 md:p-7">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
                    <div className="max-w-2xl">
                      <p className="font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ color: cultureColor[culture] }}>
                        {culture}
                      </p>
                      <h3 className="font-display text-3xl text-[var(--ink)] mt-2">{culture} tradition collection</h3>
                      <p className="font-body text-sm text-[var(--ink-soft)] leading-7 mt-3">{familyNotes[culture]}</p>
                    </div>

                    <Link
                      href={`/recipes?cultural=${culture}`}
                      className="chip-link self-start"
                      style={{ borderColor: cultureColor[culture] }}
                    >
                      View all {culture}
                    </Link>
                  </div>

                  <div
                    className="recipe-carousel"
                    style={{ gridAutoColumns: "clamp(17rem, calc((100% - 1.25rem) / 2), 38rem)" }}
                  >
                    {cultureRecipes.map((recipe: Recipe) => (
                      <div key={recipe.id} className="recipe-carousel-item">
                        <RecipeCard recipe={recipe} />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="section-card rounded-[1.5rem] p-6 md:p-7">
            <p className="eyebrow mb-4">Seasonal picks</p>
            <h2 className="font-display text-3xl text-[var(--ink)]">Holiday recipes and celebration bakes.</h2>
            <p className="font-body text-sm text-[var(--ink-soft)] leading-7 mt-3 mb-6">
              The strongest overlap between your collection and the recipe-portal model is seasonal browsing, so this section should stay prominent.
            </p>
            <div className="space-y-4">
              {holidaySpotlight.map((recipe: Recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="block rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 card-lift">
                  <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    {recipe.holiday} / {recipe.cultural}
                  </p>
                  <h3 className="font-display text-xl text-[var(--ink)] mt-1">{recipe.title}</h3>
                </Link>
              ))}
            </div>
          </section>

          <section className="section-card rounded-[1.5rem] p-6 md:p-7">
            <p className="eyebrow mb-4">Dessert spotlight</p>
            <h2 className="font-display text-3xl text-[var(--ink)]">Bake-first recipes worth highlighting.</h2>
            <div className="mt-6 space-y-4">
              {dessertSpotlight.map((recipe: Recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 card-lift">
                  <div>
                    <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">{recipe.cultural}</p>
                    <h3 className="font-display text-xl text-[var(--ink)] mt-1">{recipe.title}</h3>
                  </div>
                  <span className="font-sans-alt text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--accent)]">Open</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

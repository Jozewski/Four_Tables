import Link from "next/link";
import RecipeImage from "@/components/RecipeImage";
import RecipeFormModal from "@/components/RecipeFormModal";
import { getSafeImageUrl } from "@/lib/images";
import { RecipeFormValues } from "@/lib/recipeValidation";

const cultureColor: Record<string, string> = {
  Italian: "var(--italian)",
  Dutch: "var(--dutch)",
  German: "var(--german)",
  Mexican: "var(--mexican)",
};

type Ingredient = {
  id: number;
  order: number;
  amount: string;
  unit: string | null;
  name: string;
};

type Step = {
  id: number;
  stepNumber: number;
  instruction: string;
};

type FamilyNote = {
  id: number;
  author: string;
  content: string;
};

type Recipe = {
  id: number;
  title: string;
  description: string | null;
  cultural: string;
  holiday: string | null;
  category: string;
  prepTime: number | null;
  imageUrl: string | null;
  ingredients: Ingredient[];
  steps: Step[];
  notes: FamilyNote[];
};

function formatPrepTime(minutes: number | null): string {
  if (!minutes) return "Time not set";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function cultureInitial(cultural: string): string {
  return cultural.slice(0, 1).toUpperCase();
}

export default function RecipeInlineListItem({ recipe }: { recipe: Recipe }) {
  const color = cultureColor[recipe.cultural] ?? "var(--ink)";
  const imageUrl = getSafeImageUrl(recipe.imageUrl);
  const initialValues: RecipeFormValues = {
    title: recipe.title,
    description: recipe.description ?? "",
    cultural: recipe.cultural,
    holiday: recipe.holiday ?? "",
    category: recipe.category,
    prepTime: recipe.prepTime ? String(recipe.prepTime) : "",
    imageUrl: recipe.imageUrl ?? "",
    ingredients: recipe.ingredients.map((ingredient) => ({
      amount: ingredient.amount,
      unit: ingredient.unit ?? "",
      name: ingredient.name,
    })),
    steps: recipe.steps.map((step) => ({ instruction: step.instruction })),
    notes: recipe.notes.map((note) => ({ author: note.author, content: note.content })),
  };

  return (
    <article className="recipe-list-item">
      <Link
        href={`/recipes/${recipe.id}`}
        className="recipe-list-media"
        aria-label={`Open ${recipe.title}`}
      >
        {imageUrl ? (
          <RecipeImage
            src={imageUrl}
            alt={recipe.title}
            width={900}
            height={700}
            className="h-full w-full object-cover"
            sizes="(max-width: 767px) 100vw, 15rem"
          />
        ) : (
          <div
            className="flex h-full min-h-[13rem] items-center justify-center font-display text-6xl text-white"
            style={{ backgroundColor: color }}
          >
            {cultureInitial(recipe.cultural)}
          </div>
        )}
      </Link>

      <div className="recipe-list-content">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            <span
              className="rounded-full border px-2.5 py-1 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.16em]"
              style={{ borderColor: color, color }}
            >
              {recipe.cultural}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--ink-soft)]">
              {recipe.holiday ?? recipe.category}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
              {formatPrepTime(recipe.prepTime)}
            </span>
          </div>

          <Link href={`/recipes/${recipe.id}`} className="group">
            <h2 className="font-display text-3xl leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
              {recipe.title}
            </h2>
          </Link>

          {recipe.description && (
            <p className="mt-3 line-clamp-2 font-body text-sm leading-7 text-[var(--ink-soft)]">
              {recipe.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link
              href={`/recipes/${recipe.id}`}
              className="inline-flex min-h-10 items-center justify-center rounded-full px-5 py-2.5 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.12em] shadow-[0_10px_22px_rgba(217,106,39,0.22)] transition"
              style={{ backgroundColor: "var(--accent)", color: "#fff" }}
            >
              Open Recipe
            </Link>
            <RecipeFormModal
              mode="edit"
              recipeId={recipe.id}
              initialValues={initialValues}
              triggerLabel="Edit"
              triggerClassName="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.12em] text-[var(--ink-soft)] hover:border-[var(--accent)] hover:text-[var(--ink)]"
            />
          </div>
        </div>

        <aside className="recipe-snapshot">
          <p className="mb-3 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            Recipe Snapshot
          </p>
          <div className="grid grid-cols-3 gap-2 border-b border-[var(--border)] pb-3 text-center">
            <div>
              <p className="font-display text-2xl text-[var(--ink)]">{recipe.ingredients.length}</p>
              <p className="font-sans-alt text-[9px] font-extrabold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                Items
              </p>
            </div>
            <div>
              <p className="font-display text-2xl text-[var(--ink)]">{recipe.steps.length}</p>
              <p className="font-sans-alt text-[9px] font-extrabold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                Steps
              </p>
            </div>
            <div>
              <p className="font-display text-2xl text-[var(--ink)]">{recipe.notes.length}</p>
              <p className="font-sans-alt text-[9px] font-extrabold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                Notes
              </p>
            </div>
          </div>

          <ul className="mt-3 space-y-2">
            {recipe.ingredients.slice(0, 4).map((ingredient) => (
              <li key={ingredient.id} className="font-body text-sm leading-6 text-[var(--ink-soft)]">
                <span className="font-semibold text-[var(--ink)]">
                  {ingredient.amount}
                  {ingredient.unit ? ` ${ingredient.unit}` : ""}
                </span>{" "}
                {ingredient.name}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  );
}

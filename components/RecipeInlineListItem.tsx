import Image from "next/image";
import { getSafeImageUrl } from "@/lib/images";

const cultureColor: Record<string, string> = {
  Italian: "var(--italian)",
  Dutch: "var(--dutch)",
  German: "var(--german)",
  Mexican: "var(--mexican)",
};

const holidayEmoji: Record<string, string> = {
  Christmas: "🎄",
  Easter: "🐣",
  Thanksgiving: "🍂",
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
  if (!minutes) return "Not specified";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function RecipeInlineListItem({ recipe }: { recipe: Recipe }) {
  const color = cultureColor[recipe.cultural] ?? "var(--ink)";
  const imageUrl = getSafeImageUrl(recipe.imageUrl);

  return (
    <article className="section-card rounded-[1.6rem] p-4 md:p-5 lg:p-6">
      <style>{`
        .recipe-inline-layout-fixed {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          align-items: stretch;
        }

        .recipe-inline-media-fixed {
          min-height: 200px;
        }

        .recipe-inline-ingredients-fixed {
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 640px) {
          .recipe-inline-layout-fixed {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .recipe-inline-media-fixed {
            min-height: 240px;
          }
        }

        @media (min-width: 768px) {
          .recipe-inline-layout-fixed {
            gap: 1.25rem;
          }

          .recipe-inline-media-fixed {
            min-height: 288px;
          }
        }
      `}</style>
      <header className="mb-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className="font-sans-alt text-[10px] font-extrabold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border"
            style={{ borderColor: color, color }}
          >
            {recipe.cultural}
          </span>
          <span className="font-sans-alt text-[10px] font-extrabold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-soft)]">
            {recipe.holiday ? `${holidayEmoji[recipe.holiday] ?? ""} ${recipe.holiday}` : recipe.category}
          </span>
          <span className="font-sans-alt text-[10px] font-extrabold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)]">
            {formatPrepTime(recipe.prepTime)}
          </span>
        </div>

        <h2 className="font-display text-2xl md:text-4xl text-[var(--ink)] leading-tight">
          {recipe.title}
        </h2>

        {recipe.description && (
          <p className="font-body text-sm md:text-base text-[var(--ink-soft)] leading-7 mt-3">
            {recipe.description}
          </p>
        )}
      </header>

      <div className="recipe-inline-layout-fixed">
        <section className="recipe-inline-media-fixed rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] overflow-hidden order-1">
          <div className="relative w-full h-full bg-[var(--cream-dark)]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={recipe.title}
                width={1200}
                height={900}
                className="w-full h-full object-cover"
                sizes="(max-width: 639px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-35">
                {recipe.cultural === "Italian" ? "🍝" : recipe.cultural === "Dutch" ? "🌷" : recipe.cultural === "German" ? "🦢" : "🌶️"}
              </div>
            )}
          </div>
        </section>

        <section className="recipe-inline-ingredients-fixed rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5 h-full order-2">
          <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)] mb-3">
            Ingredients ({recipe.ingredients.length})
          </p>
          <ul className="flex-1 grid gap-2 sm:gap-3">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id} className="font-body text-sm text-[var(--ink-soft)] leading-6 break-words">
                <span className="font-semibold text-[var(--ink)]">{ingredient.amount}{ingredient.unit ? ` ${ingredient.unit}` : ""}</span> {ingredient.name}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5 mt-4 md:mt-5">
        <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)] mb-4">
          Instructions ({recipe.steps.length})
        </p>

        <div className="space-y-3">
          {recipe.steps.map((step) => (
            <div key={step.id} className="rounded-[0.9rem] border border-[var(--border)] bg-[var(--surface-soft)] p-3 md:p-4">
              <p className="font-body text-sm text-[var(--ink-soft)] leading-7">
                <span className="inline-flex items-center justify-center h-6 min-w-6 px-1 rounded-full bg-[var(--ink)] text-white font-sans-alt text-[10px] font-extrabold mr-2 align-middle shrink-0">
                  {step.stepNumber}
                </span>
                {step.instruction}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:p-5 mt-4 md:mt-5">
        <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)] mb-3">
          Family Notes ({recipe.notes.length})
        </p>

        {recipe.notes.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {recipe.notes.map((note) => (
              <blockquote key={note.id} className="rounded-[0.9rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4" style={{ borderLeftColor: color, borderLeftWidth: "3px" }}>
                <p className="font-body text-sm italic text-[var(--ink-soft)] leading-6">&ldquo;{note.content}&rdquo;</p>
                <footer className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--ink-muted)] mt-1">
                  {note.author}
                </footer>
              </blockquote>
            ))}
          </div>
        ) : (
          <p className="font-body text-sm text-[var(--ink-muted)] italic">No family notes yet.</p>
        )}
      </section>
    </article>
  );
}

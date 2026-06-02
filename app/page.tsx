import Link from "next/link";
import { prisma } from "@/lib/prisma";

const tables = [
  {
    cultural: "Italian",
    matriarch: "Grandma Louise",
    origin: "Naples, Italy",
    color: "var(--italian)",
    description:
      "Handmade pasta rolled on a wooden board, slow Sunday ragù, and artichokes that take all morning to stuff. Grandma Louise's kitchen runs on patience and olive oil.",
    emoji: "🍝",
  },
  {
    cultural: "Dutch",
    matriarch: "Oma",
    origin: "Amsterdam, Netherlands",
    color: "var(--dutch)",
    description:
      "Split pea soup thick enough for a spoon to stand in, Easter bread filled with almond paste, and stamppot that feeds a crowd and travels well across the city.",
    emoji: "🌷",
  },
  {
    cultural: "German",
    matriarch: "Father's family",
    origin: "Germany",
    color: "var(--german)",
    description:
      "A Christmas goose that roasts for three hours, an Easter lamb cake in a mold that has been in the family since before anyone can remember, and sauerbraten you start on Monday.",
    emoji: "🦢",
  },
  {
    cultural: "Mexican",
    matriarch: "Tía Carmen & Abuela Rosa",
    origin: "Mexico",
    color: "var(--mexican)",
    description:
      "Bacalao soaked for two days, capirotada layered with cheese that melts into the syrup, and a mole negro that takes all day and tastes like it.",
    emoji: "🌶️",
  },
];

export default async function HomePage() {
  const totalRecipes = await prisma.recipe.count();
  const recentRecipes = await prisma.recipe.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, cultural: true, holiday: true },
  });

  return (
    <div>
      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center fade-up">
        <p className="ornamental-rule justify-center mb-8 fade-up">
          {totalRecipes} recipes across four traditions
        </p>
        <h1 className="font-display text-6xl md:text-7xl font-bold text-[var(--ink)] leading-[1.05] mb-6 fade-up fade-up-delay-1">
          One family,
          <br />
          <span className="italic font-normal">four tables.</span>
        </h1>
        <p className="font-body text-lg text-[var(--ink-soft)] max-w-2xl mx-auto leading-relaxed mb-10 fade-up fade-up-delay-2">
          Traditional holiday recipes from the Italian, Dutch, German, and Mexican sides
          of one family — all gathered in one place for the first time.
        </p>
        <div className="flex gap-4 justify-center fade-up fade-up-delay-3">
          <Link
            href="/recipes"
            className="font-sans-alt text-sm tracking-[0.15em] uppercase px-8 py-3 bg-[var(--ink)] text-[var(--cream)] hover:bg-[var(--ink-soft)] transition-colors"
          >
            Browse All Recipes
          </Link>
          <Link
            href="/recipes?holiday=Christmas"
            className="font-sans-alt text-sm tracking-[0.15em] uppercase px-8 py-3 border border-[var(--border)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors"
          >
            Holiday Recipes
          </Link>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex h-px bg-[var(--border)]" />
      </div>

      {/* ── Four Tables ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-2">The Four Tables</h2>
        <p className="font-sans-alt text-xs tracking-[0.2em] uppercase text-center text-[var(--ink-muted)] mb-14">
          Each family. Each tradition.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {tables.map((t, i) => (
            <Link
              key={t.cultural}
              href={`/recipes?cultural=${t.cultural}`}
              className="card-lift group block border border-[var(--border)] bg-white/60 p-8 relative overflow-hidden"
            >
              {/* Accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: t.color }}
              />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className="font-sans-alt text-[10px] tracking-[0.25em] uppercase font-semibold"
                    style={{ color: t.color }}
                  >
                    {t.cultural}
                  </span>
                  <h3 className="font-display text-xl font-bold text-[var(--ink)] mt-1">
                    {t.matriarch}
                  </h3>
                  <p className="font-sans-alt text-[11px] tracking-widest uppercase text-[var(--ink-muted)] mt-0.5">
                    {t.origin}
                  </p>
                </div>
                <span className="text-3xl">{t.emoji}</span>
              </div>
              <p className="font-body text-sm text-[var(--ink-soft)] leading-relaxed">
                {t.description}
              </p>
              <p
                className="font-sans-alt text-xs tracking-[0.15em] uppercase mt-6 transition-colors"
                style={{ color: t.color }}
              >
                See recipes →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Holiday filter strip ── */}
      <section className="bg-[var(--cream-dark)] border-y border-[var(--border)] py-14">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Browse by Holiday</h2>
          <p className="font-body text-sm text-[var(--ink-muted)] italic mb-8">
            Every table comes together three times a year.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {["Christmas", "Easter", "Thanksgiving"].map((h) => (
              <Link
                key={h}
                href={`/recipes?holiday=${h}`}
                className="card-lift font-sans-alt text-sm tracking-[0.15em] uppercase px-10 py-4 border border-[var(--border)] bg-white/70 text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--gold)] transition-colors"
              >
                {h === "Christmas" && "🎄 "}
                {h === "Easter" && "🐣 "}
                {h === "Thanksgiving" && "🍂 "}
                {h}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent additions ── */}
      {recentRecipes.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="ornamental-rule mb-10">Recently Added</div>
          <div className="grid md:grid-cols-3 gap-6">
            {recentRecipes.map((r) => (
              <Link
                key={r.id}
                href={`/recipes/${r.id}`}
                className="card-lift block border border-[var(--border)] p-6 bg-white/60"
              >
                <span
                  className="font-sans-alt text-[10px] tracking-[0.2em] uppercase"
                  style={{
                    color:
                      r.cultural === "Italian" ? "var(--italian)"
                      : r.cultural === "Dutch"   ? "var(--dutch)"
                      : r.cultural === "German"  ? "var(--german)"
                      : "var(--mexican)",
                  }}
                >
                  {r.cultural} · {r.holiday}
                </span>
                <h3 className="font-display text-lg font-semibold text-[var(--ink)] mt-2 leading-snug">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

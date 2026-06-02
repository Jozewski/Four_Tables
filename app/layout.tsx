import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Four Tables",
  description:
    "Traditional holiday recipes from four family traditions — Italian, Dutch, German, and Mexican.",
};

const cultures = [
  { label: "Italian",  color: "var(--italian)",  flag: "🇮🇹" },
  { label: "Dutch",    color: "var(--dutch)",    flag: "🇳🇱" },
  { label: "German",   color: "var(--german)",   flag: "🇩🇪" },
  { label: "Mexican",  color: "var(--mexican)",  flag: "🇲🇽" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* ── Top culture stripe ── */}
        <div className="flex h-1">
          {cultures.map((c) => (
            <div key={c.label} className="flex-1" style={{ backgroundColor: c.color }} />
          ))}
        </div>

        {/* ── Navigation ── */}
        <header className="border-b border-[var(--border)] bg-[var(--cream)]">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="group flex flex-col leading-tight">
              <span
                className="font-display text-2xl font-bold tracking-tight text-[var(--ink)]"
                style={{ letterSpacing: "-0.01em" }}
              >
                Four Tables
              </span>
              <span className="font-sans-alt text-[10px] tracking-[0.25em] uppercase text-[var(--ink-muted)] mt-0.5">
                A Family Recipe Collection
              </span>
            </Link>

            <nav className="flex items-center gap-8">
              <Link
                href="/recipes"
                className="font-sans-alt text-xs tracking-[0.15em] uppercase text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
              >
                All Recipes
              </Link>
              {cultures.map((c) => (
                <Link
                  key={c.label}
                  href={`/recipes?cultural=${c.label}`}
                  className="font-sans-alt text-xs tracking-[0.15em] uppercase transition-colors hidden md:block"
                  style={{ color: c.color }}
                >
                  {c.flag} {c.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="min-h-screen">{children}</main>

        {/* ── Footer ── */}
        <footer className="border-t border-[var(--border)] mt-24">
          <div className="max-w-6xl mx-auto px-6 py-10 text-center">
            <p className="font-sans-alt text-[11px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">
              Four Tables &mdash; Italian · Dutch · German · Mexican
            </p>
            <p className="font-body text-sm text-[var(--ink-muted)] mt-2 italic">
              Recipes passed down, traditions carried forward.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

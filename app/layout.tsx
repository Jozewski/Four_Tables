import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Four Tables",
  description:
    "A family recipe collection shaped like a modern recipe portal, built around Italian, Dutch, German, and Mexican traditions.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

const cultures = [
  { label: "Italian",  color: "var(--italian)",  chipBg: "rgba(184, 61, 45, 0.12)", flag: "🇮🇹" },
  { label: "Dutch",    color: "var(--dutch)",    chipBg: "rgba(29, 90, 146, 0.12)", flag: "🇳🇱" },
  { label: "German",   color: "var(--german)",   chipBg: "rgba(71, 101, 46, 0.12)", flag: "🇩🇪" },
  { label: "Mexican",  color: "var(--mexican)",  chipBg: "rgba(199, 102, 30, 0.14)", flag: "🇲🇽" },
];

const siteLinks = [
  { label: "All Recipes", href: "/recipes" },
  { label: "Mains", href: "/recipes?category=Main" },
  { label: "Soups", href: "/recipes?category=Soup" },
  { label: "Sweets", href: "/recipes?category=Dessert" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <div className="flex h-1">
          {cultures.map((c) => (
            <div key={c.label} className="flex-1" style={{ backgroundColor: c.color }} />
          ))}
        </div>

        <header className="border-b border-[var(--border)] bg-white/90 backdrop-blur-sm sticky top-0 z-40">
          <div className="border-b border-[var(--border)] bg-[var(--accent-soft)]">
            <div className="portal-shell py-3 flex items-center justify-between gap-4 text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.16em] text-[var(--ink-soft)]">
              <div className="hidden md:flex items-center gap-5 text-[var(--ink-muted)]">
                <Link href="/recipes?holiday=Christmas" className="hover:text-[var(--ink)] transition-colors">Christmas</Link>
                <Link href="/recipes?holiday=Easter" className="hover:text-[var(--ink)] transition-colors">Easter</Link>
                <Link href="/recipes?category=Dessert" className="hover:text-[var(--ink)] transition-colors">Desserts</Link>
              </div>

              <details className="relative md:hidden ml-auto">
                <summary className="list-none inline-flex cursor-pointer items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.16em] text-[var(--ink)] shadow-sm">
                  <span className="flex flex-col gap-1">
                    <span className="block h-0.5 w-4 bg-[var(--ink)]" />
                    <span className="block h-0.5 w-4 bg-[var(--ink)]" />
                    <span className="block h-0.5 w-4 bg-[var(--ink)]" />
                  </span>
                  Menu
                </summary>

                <div className="absolute right-0 top-full mt-3 w-[min(84vw,16rem)] rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_20px_50px_rgba(24,24,27,0.12)]">
                  <div className="grid gap-4">
                    <div>
                      <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)] mb-3">Browse</p>
                      <div className="grid grid-cols-1 gap-2 text-center">
                        {siteLinks.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="inline-flex w-full items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.14em] text-[var(--ink-soft)]"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)] mb-3">Cultures</p>
                      <div className="grid grid-cols-1 gap-2 text-center">
                        {cultures.map((c) => (
                          <Link
                            key={c.label}
                            href={`/recipes?cultural=${c.label}`}
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.12em]"
                            style={{ color: c.color, borderColor: c.color, backgroundColor: c.chipBg }}
                          >
                            <span style={{ fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif" }}>{c.flag}</span>
                            <span>{c.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>

          <div className="portal-shell py-5 flex flex-col gap-6 items-center text-center">
            <div className="flex items-center justify-center gap-4">
              <Link href="/" className="group flex flex-col leading-none">
                <span className="font-display text-[2rem] font-bold tracking-tight text-[var(--ink)]">
                  Four Tables
                </span>
                <span className="font-sans-alt text-[11px] tracking-[0.24em] uppercase text-[var(--ink-muted)] mt-2">
                  Recipes passed between generations
                </span>
              </Link>
            </div>

            <div className="w-full max-w-4xl">
              <div className="hidden md:flex flex-col items-center gap-5 text-center">
                <div className="max-w-2xl">
                  <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">Browse the collection</p>
                  <p className="font-body text-sm text-[var(--ink-soft)] mt-1 max-w-md mx-auto">Find recipes by family tradition, holiday, or course.</p>
                </div>
                <Link
                  href="/recipes"
                  className="inline-flex min-w-[17rem] items-center justify-center rounded-full bg-[var(--accent)] px-9 py-4 text-[13px] font-sans-alt font-extrabold uppercase tracking-[0.08em] text-white whitespace-nowrap"
                >
                  Explore Recipes
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:block border-t border-[var(--border)] bg-white/85">
            <div className="portal-shell py-4 grid grid-cols-1 gap-5 md:grid-cols-2 md:items-start text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.14em] text-[var(--ink-soft)] text-center">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 min-w-0">
                {siteLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 hover:text-[var(--ink)] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4 justify-items-center md:justify-items-end min-w-0 md:pl-6">
                {cultures.map((c) => (
                  <Link
                    key={c.label}
                    href={`/recipes?cultural=${c.label}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 transition-colors hover:brightness-95"
                    style={{ color: c.color, borderColor: c.color, backgroundColor: c.chipBg }}
                  >
                    <span style={{ fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif" }}>{c.flag}</span>
                    <span>{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="border-t border-[var(--border)] mt-24 bg-[var(--surface-soft)]">
          <div className="portal-shell py-12 grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <p className="eyebrow mb-4">Four Tables</p>
              <h2 className="font-display text-3xl text-[var(--ink)]">A family recipe archive built for browsing.</h2>
              <p className="font-body text-sm text-[var(--ink-soft)] mt-3 max-w-xl leading-7">
                This project collects recipes from four family traditions and presents them with the clarity of a modern cooking site, without the ad-heavy clutter.
              </p>
            </div>

            <div>
              <p className="font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)] mb-4">Explore</p>
              <div className="space-y-3 font-body text-sm text-[var(--ink-soft)]">
                <Link href="/recipes" className="block hover:text-[var(--ink)] transition-colors">All Recipes</Link>
                <Link href="/recipes?category=Dessert" className="block hover:text-[var(--ink)] transition-colors">Desserts</Link>
                <Link href="/recipes?holiday=Christmas" className="block hover:text-[var(--ink)] transition-colors">Holiday Favorites</Link>
              </div>
            </div>

            <div>
              <p className="font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)] mb-4">Traditions</p>
              <div className="space-y-3 font-body text-sm text-[var(--ink-soft)]">
                {cultures.map((c) => (
                  <Link key={c.label} href={`/recipes?cultural=${c.label}`} className="block transition-colors hover:text-[var(--ink)]">
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

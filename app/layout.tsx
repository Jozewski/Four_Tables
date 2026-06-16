import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import ContributorSignOutButton from "@/components/ContributorSignOutButton";
import ThemeToggle from "@/components/ThemeToggle";
import { CONTRIBUTOR_COOKIE_NAME, verifyContributorSessionToken } from "@/lib/contributorAuth";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Four Tables",
  description:
    "A family recipe collection shaped like a modern recipe portal, built around Italian, Dutch, German, and Mexican traditions.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Four Tables",
    title: "Four Tables",
    description:
      "A family recipe collection shaped like a modern recipe portal, built around Italian, Dutch, German, and Mexican traditions.",
  },
};

const cultures = [
  { label: "Italian", color: "var(--italian)", chipBg: "rgba(184, 61, 45, 0.12)" },
  { label: "Dutch", color: "var(--dutch)", chipBg: "rgba(29, 90, 146, 0.12)" },
  { label: "German", color: "var(--german)", chipBg: "rgba(71, 101, 46, 0.12)" },
  { label: "Mexican", color: "var(--mexican)", chipBg: "rgba(199, 102, 30, 0.14)" },
];

const siteLinks = [
  { label: "All Recipes", href: "/recipes" },
  { label: "Mains", href: "/recipes?category=Main" },
  { label: "Soups", href: "/recipes?category=Soup" },
  { label: "Sweets", href: "/recipes?category=Dessert" },
];

async function hasContributorAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CONTRIBUTOR_COOKIE_NAME)?.value;
  return Boolean(verifyContributorSessionToken(token));
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const signedIn = await hasContributorAccess();

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <div className="flex h-1">
          {cultures.map((culture) => (
            <div
              key={culture.label}
              className="flex-1"
              style={{ backgroundColor: culture.color }}
            />
          ))}
        </div>

        <header className="site-header">
          <div className="portal-shell site-header-inner">
            <Link href="/" className="group flex shrink-0 flex-col leading-none">
              <span className="font-display text-[1.9rem] font-bold tracking-tight text-[var(--ink)]">
                Four Tables
              </span>
              <span className="mt-1 font-sans-alt text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                Family recipe archive
              </span>
            </Link>

            <nav className="site-nav">
              {siteLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="site-pill"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="culture-nav">
              {cultures.map((culture) => (
                <Link
                  key={culture.label}
                  href={`/recipes?cultural=${culture.label}`}
                  className="site-pill"
                  style={{
                    color: culture.color,
                    borderColor: culture.color,
                    backgroundColor: culture.chipBg,
                  }}
                >
                  {culture.label}
                </Link>
              ))}
              {signedIn && <ContributorSignOutButton compact />}
              <ThemeToggle />
            </div>

            <div className="mobile-menu ml-auto flex items-center gap-2">
              <ThemeToggle />
            <details className="relative">
              <summary className="inline-flex cursor-pointer list-none items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--ink)] shadow-sm">
                <span className="flex flex-col gap-1">
                  <span className="block h-0.5 w-4 bg-[var(--ink)]" />
                  <span className="block h-0.5 w-4 bg-[var(--ink)]" />
                  <span className="block h-0.5 w-4 bg-[var(--ink)]" />
                </span>
                Menu
              </summary>

              <div className="absolute right-0 top-full mt-3 w-[min(84vw,17rem)] rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_20px_50px_rgba(24,24,27,0.12)]">
                <div className="grid gap-4">
                  {signedIn && (
                    <div className="grid gap-2 border-b border-[var(--border)] pb-4">
                      <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--accent)]">
                        Contributor
                      </p>
                      <ContributorSignOutButton compact />
                    </div>
                  )}
                  <div>
                    <p className="mb-3 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                      Browse
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-center">
                      {siteLinks.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="inline-flex w-full items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--ink-soft)]"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                      Traditions
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-center">
                      {cultures.map((culture) => (
                        <Link
                          key={culture.label}
                          href={`/recipes?cultural=${culture.label}`}
                          className="inline-flex w-full items-center justify-center rounded-full border px-3 py-2 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.12em]"
                          style={{
                            color: culture.color,
                            borderColor: culture.color,
                            backgroundColor: culture.chipBg,
                          }}
                        >
                          {culture.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </details>
            </div>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="mt-20 border-t border-[var(--border)] bg-[var(--surface-soft)]">
          <div className="portal-shell grid gap-8 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <p className="eyebrow mb-4">Four Tables</p>
              <h2 className="font-display text-3xl text-[var(--ink)]">
                A family recipe archive built for browsing.
              </h2>
              <p className="mt-3 max-w-xl font-body text-sm leading-7 text-[var(--ink-soft)]">
                Recipes from four family traditions, organized for fast browsing,
                clear cooking, and easy updates.
              </p>
            </div>

            <div>
              <p className="mb-4 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                Explore
              </p>
              <div className="space-y-3 font-body text-sm text-[var(--ink-soft)]">
                <Link href="/recipes" className="block transition-colors hover:text-[var(--ink)]">
                  All Recipes
                </Link>
                <Link
                  href="/recipes?category=Dessert"
                  className="block transition-colors hover:text-[var(--ink)]"
                >
                  Desserts
                </Link>
                <Link
                  href="/recipes?holiday=Christmas"
                  className="block transition-colors hover:text-[var(--ink)]"
                >
                  Holiday Favorites
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-4 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                Traditions
              </p>
              <div className="space-y-3 font-body text-sm text-[var(--ink-soft)]">
                {cultures.map((culture) => (
                  <Link
                    key={culture.label}
                    href={`/recipes?cultural=${culture.label}`}
                    className="block transition-colors hover:text-[var(--ink)]"
                  >
                    {culture.label}
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

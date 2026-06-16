import Link from "next/link";
import { cookies } from "next/headers";
import ContributorSignInForm from "@/components/ContributorSignInForm";
import { CONTRIBUTOR_COOKIE_NAME, verifyContributorSessionToken } from "@/lib/contributorAuth";

async function hasContributorAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CONTRIBUTOR_COOKIE_NAME)?.value;
  return Boolean(verifyContributorSessionToken(token));
}

export default async function ContributorPage() {
  const signedIn = await hasContributorAccess();

  return (
    <div className="portal-shell py-10 md:py-14">
      <section className="mx-auto max-w-2xl rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_55px_rgba(24,24,27,0.08)] md:p-8">
        <p className="eyebrow mb-4">Contributor Access</p>
        <h1 className="font-display text-4xl font-bold leading-tight text-[var(--ink)] md:text-5xl">
          {signedIn ? "Contributor access is active." : "Sign in to add family recipes."}
        </h1>
        <p className="mt-4 font-body text-sm leading-7 text-[var(--ink-soft)] md:text-base">
          {signedIn
            ? "You can add recipes, edit saved recipes, upload family photos, use AI assist, and archive recipes."
            : "Public browsing stays open. Recipe changes are limited to invited contributors with the shared family invite code."}
        </p>

        {signedIn ? (
          <div className="mt-7 rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <div>
              <p className="font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--accent)]">
                Signed In
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
                Contributor tools are available while your header log out control remains active.
              </p>
            </div>
            <Link
              href="/recipes"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(217,106,39,0.25)] sm:w-auto"
            >
              Manage Recipes
            </Link>
          </div>
        ) : (
          <ContributorSignInForm />
        )}
      </section>
    </div>
  );
}

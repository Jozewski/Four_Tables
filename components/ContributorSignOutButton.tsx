"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  compact?: boolean;
};

export default function ContributorSignOutButton({ compact = false }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSignOut() {
    setSubmitting(true);
    await fetch("/api/contributor/session", { method: "DELETE" }).catch(() => null);
    router.push("/recipes");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={
        compact
          ? "inline-flex min-h-9 items-center justify-center rounded-full border border-red-300 bg-red-50 px-4 py-2 font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.14em] text-red-700 shadow-sm transition hover:border-red-400 hover:bg-red-100 hover:text-red-800 disabled:opacity-60 dark:border-red-400/40 dark:bg-red-950/45 dark:text-red-200 dark:hover:bg-red-900/55"
          : "inline-flex min-h-11 items-center justify-center rounded-full border border-red-300 bg-red-50 px-6 py-3 font-sans-alt text-[11px] font-extrabold uppercase tracking-[0.14em] text-red-700 shadow-sm transition hover:border-red-400 hover:bg-red-100 hover:text-red-800 disabled:opacity-60 dark:border-red-400/40 dark:bg-red-950/45 dark:text-red-200 dark:hover:bg-red-900/55"
      }
      disabled={submitting}
    >
      {submitting ? "Logging Out..." : "Log Out"}
    </button>
  );
}

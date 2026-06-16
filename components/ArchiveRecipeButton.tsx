"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  recipeId: number;
  recipeTitle: string;
};

export default function ArchiveRecipeButton({ recipeId, recipeTitle }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState("");

  function closeModal() {
    if (archiving) return;
    setOpen(false);
    setError("");
  }

  async function archiveRecipe() {
    setArchiving(true);
    setError("");

    try {
      const response = await fetch(`/api/recipes/${recipeId}/archive`, { method: "PATCH" });
      const json = (await response.json().catch(() => null)) as
        | { ok?: boolean; errors?: string[] }
        | null;

      if (!response.ok || !json?.ok) {
        setError(json?.errors?.length ? json.errors.join(" ") : "Unable to archive recipe right now.");
        return;
      }

      setOpen(false);
      router.refresh();
    } catch {
      setError("Unable to archive recipe right now.");
    } finally {
      setArchiving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.12em] text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]"
        aria-label={`Archive ${recipeTitle}`}
      >
        Archive
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-[rgba(15,23,42,0.62)] px-5 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Archive recipe"
            className="w-full max-w-md rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow mb-4">Archive recipe</p>
            <h2 className="font-display text-3xl text-[var(--ink)]">Archive this recipe?</h2>
            <p className="mt-3 font-body text-sm leading-7 text-[var(--ink-soft)]">
              <span className="font-semibold text-[var(--ink)]">{recipeTitle}</span> will leave the main recipe list
              but stay available from the archived recipes view.
            </p>

            {error && (
              <p className="mt-4 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]"
                disabled={archiving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void archiveRecipe()}
                className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-sans-alt font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_10px_22px_rgba(56,189,248,0.22)] transition hover:brightness-110 disabled:opacity-60"
                disabled={archiving}
              >
                {archiving ? "Archiving..." : "Confirm archive"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

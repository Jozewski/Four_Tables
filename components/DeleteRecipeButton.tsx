"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  recipeId: number;
  recipeTitle: string;
};

export default function DeleteRecipeButton({ recipeId, recipeTitle }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${recipeTitle}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, { method: "DELETE" });
      const json = (await response.json().catch(() => null)) as
        | { ok?: boolean; errors?: string[] }
        | null;

      if (!response.ok || !json?.ok) {
        setError(json?.errors?.length ? json.errors.join(" ") : "Unable to delete recipe right now.");
        return;
      }

      router.refresh();
    } catch {
      setError("Unable to delete recipe right now.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <span className="inline-flex flex-col gap-2">
      <button
        type="button"
        onClick={handleDelete}
        className="inline-flex min-h-10 items-center justify-center rounded-full border border-red-300 bg-red-50 px-5 py-2.5 text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-500 hover:bg-red-100 disabled:opacity-60"
        aria-label={`Delete ${recipeTitle}`}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
      {error && (
        <span className="max-w-52 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </span>
      )}
    </span>
  );
}

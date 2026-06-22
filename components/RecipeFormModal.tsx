"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  CATEGORIES,
  CULTURES,
  EMPTY_RECIPE_FORM,
  HOLIDAYS,
  RecipeFormValues,
  validateRecipeInput,
} from "@/lib/recipeValidation";

type Props = {
  mode: "create" | "edit";
  recipeId?: number;
  triggerLabel: string;
  triggerClassName?: string;
  initialValues?: RecipeFormValues;
};

function cloneValues(values: RecipeFormValues): RecipeFormValues {
  return {
    ...values,
    ingredients: values.ingredients.map((i) => ({ ...i })),
    steps: values.steps.map((s) => ({ ...s })),
    notes: values.notes.map((n) => ({ ...n })),
  };
}

export default function RecipeFormModal({
  mode,
  recipeId,
  triggerLabel,
  triggerClassName,
  initialValues,
}: Props) {
  const router = useRouter();
  const imageUploadId = useId();
  const defaultValues = useMemo(
    () => cloneValues(initialValues ?? EMPTY_RECIPE_FORM),
    [initialValues],
  );

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<RecipeFormValues>(defaultValues);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [aiNotes, setAiNotes] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiSubmitting, setAiSubmitting] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function openModal() {
    setValues(cloneValues(defaultValues));
    setErrors([]);
    setAiNotes("");
    setAiError("");
    setImageUploadError("");
    setOpen(true);
  }

  function closeModal() {
    if (submitting || aiSubmitting) return;
    setOpen(false);
  }

  function updateField<K extends keyof RecipeFormValues>(key: K, value: RecipeFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateIngredient(index: number, key: "amount" | "unit" | "name", value: string) {
    setValues((prev) => {
      const next = cloneValues(prev);
      next.ingredients[index][key] = value;
      return next;
    });
  }

  function updateStep(index: number, value: string) {
    setValues((prev) => {
      const next = cloneValues(prev);
      next.steps[index].instruction = value;
      return next;
    });
  }

  function updateNote(index: number, key: "author" | "content", value: string) {
    setValues((prev) => {
      const next = cloneValues(prev);
      next.notes[index][key] = value;
      return next;
    });
  }

  function addIngredient() {
    setValues((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { amount: "", unit: "", name: "" }],
    }));
  }

  function addStep() {
    setValues((prev) => ({
      ...prev,
      steps: [...prev.steps, { instruction: "" }],
    }));
  }

  function addNote() {
    setValues((prev) => ({
      ...prev,
      notes: [...prev.notes, { author: "", content: "" }],
    }));
  }

  function removeIngredient(index: number) {
    setValues((prev) => {
      const ingredients = prev.ingredients.filter((_, i) => i !== index);
      return { ...prev, ingredients: ingredients.length ? ingredients : [{ amount: "", unit: "", name: "" }] };
    });
  }

  function removeStep(index: number) {
    setValues((prev) => {
      const steps = prev.steps.filter((_, i) => i !== index);
      return { ...prev, steps: steps.length ? steps : [{ instruction: "" }] };
    });
  }

  function removeNote(index: number) {
    setValues((prev) => ({ ...prev, notes: prev.notes.filter((_, i) => i !== index) }));
  }

  async function handleAiAssist() {
    const notes = aiNotes.trim();

    if (notes.length < 10) {
      setAiError("Add at least 10 characters of recipe notes before using AI assist.");
      return;
    }

    setAiSubmitting(true);
    setAiError("");

    try {
      const response = await fetch("/api/recipes/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          currentRecipe: values,
        }),
      });

      const json = (await response.json().catch(() => null)) as
        | { ok?: boolean; values?: RecipeFormValues; errors?: string[] }
        | null;

      if (!response.ok || !json?.ok || !json.values) {
        setAiError(json?.errors?.length ? json.errors.join(" ") : "Unable to draft recipe fields right now.");
        return;
      }

      setValues(cloneValues(json.values));
      setErrors([]);
    } catch {
      setAiError("Unable to draft recipe fields right now.");
    } finally {
      setAiSubmitting(false);
    }
  }

  async function handleImageUpload(file: File | null) {
    if (!file) return;

    setImageUploading(true);
    setImageUploadError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/recipes/images", {
        method: "POST",
        body: formData,
      });

      const json = (await response.json().catch(() => null)) as
        | { ok?: boolean; imageUrl?: string; errors?: string[] }
        | null;

      if (!response.ok || !json?.ok || !json.imageUrl) {
        setImageUploadError(json?.errors?.length ? json.errors.join(" ") : "Unable to upload image right now.");
        return;
      }

      updateField("imageUrl", json.imageUrl);
    } catch {
      setImageUploadError("Unable to upload image right now.");
    } finally {
      setImageUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateRecipeInput(values);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setErrors([]);

    const endpoint = mode === "create" ? "/api/recipes" : `/api/recipes/${recipeId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const json = (await response.json().catch(() => null)) as
        | { ok?: boolean; errors?: string[] }
        | null;

      if (!response.ok || !json?.ok) {
        setErrors(json?.errors?.length ? json.errors : ["Unable to save recipe. Please try again."]);
        return;
      }

      setOpen(false);
      router.refresh();
    } catch {
      setErrors(["Unable to save recipe. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  }

  const labelClass =
    "text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.14em] text-[var(--ink-muted)]";
  const inputClass =
    "recipe-form-field w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]";
  const sectionCardClass =
    "recipe-form-section rounded-2xl border border-[var(--border)] px-5 py-4 md:px-6 md:py-5";
  const horizontalPad = "clamp(18px, 3.5vw, 42px)";

  const modalContent = open ? (
    <div
      role="dialog"
      aria-modal="true"
      className="recipe-form-overlay fixed z-[200] overflow-y-auto px-5 py-4 backdrop-blur-[2px] sm:px-7 md:px-12 md:py-8"
      style={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        paddingInline: "clamp(16px, 4vw, 64px)",
        paddingBlock: "clamp(12px, 2vh, 32px)",
      }}
      onClick={closeModal}
    >
      <div
        className="recipe-form-dialog relative mx-auto my-3 md:my-8 w-full max-w-5xl rounded-[1.6rem] border border-[var(--border)] shadow-[0_28px_90px_rgba(17,17,17,0.32)] max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] overflow-y-auto"
        style={{ width: "min(1040px, 100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="recipe-form-header sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] px-6 py-4 backdrop-blur-sm md:px-8"
          style={{ paddingInline: horizontalPad }}
        >
          <div>
            <p className="font-sans-alt text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              {mode === "create" ? "Create Recipe" : "Update Recipe"}
            </p>
            <h2 className="mt-1 font-display text-2xl md:text-[2rem] text-[var(--ink)]">
              {mode === "create" ? "Add New Recipe" : "Edit Recipe"}
            </h2>
            <p className="mt-1 text-xs md:text-sm text-[var(--ink-muted)]">
              Capture the details exactly the way your family makes it.
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="recipe-form-icon-button inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-lg leading-none text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]"
            aria-label="Close modal"
          >
            x
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 px-6 py-5 md:space-y-7 md:px-8 md:py-7"
          style={{ paddingInline: horizontalPad }}
        >
          <section className={sectionCardClass} style={{ paddingInline: "clamp(14px, 2.2vw, 26px)" }}>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <label className="space-y-2">
                <span className={labelClass}>AI recipe notes</span>
                <textarea
                  value={aiNotes}
                  onChange={(e) => setAiNotes(e.target.value)}
                  className={`${inputClass} min-h-28`}
                  placeholder="Paste rough family notes, ingredient memories, or old recipe card text."
                  disabled={aiSubmitting || submitting}
                />
              </label>
              <button
                type="button"
                onClick={handleAiAssist}
                className="recipe-form-ai-button inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-sans-alt font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--accent)] disabled:opacity-60 lg:mb-1"
                disabled={aiSubmitting || submitting}
              >
                {aiSubmitting && (
                  <span
                    role="status"
                    aria-label="Drafting recipe with AI"
                    className="recipe-form-ai-spinner inline-block h-4 w-4 animate-spin rounded-full"
                  />
                )}
                {aiSubmitting ? "Drafting..." : "Draft with AI"}
              </button>
            </div>
            {aiError && (
              <p className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {aiError}
              </p>
            )}
            <p className="mt-3 text-xs leading-5 text-[var(--ink-muted)]">
              AI drafts editable fields only. Review ingredients, steps, and family notes before saving.
            </p>
          </section>

          {errors.length > 0 && (
            <div className="rounded-xl border border-red-300 bg-red-50/95 p-4 text-sm text-red-700">
              <p className="font-semibold mb-2">Please fix the following:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <section className={sectionCardClass} style={{ paddingInline: "clamp(14px, 2.2vw, 26px)" }}>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-sans-alt text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Core Details</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className={labelClass}>Title</span>
              <input
                value={values.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={inputClass}
                required
              />
            </label>

            <label className="space-y-1">
              <span className={labelClass}>Image URL</span>
              <input
                value={values.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </label>

            <div className="space-y-1">
              <label htmlFor={imageUploadId} className={labelClass}>
                Upload Family Photo
              </label>
              <input
                id={imageUploadId}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => void handleImageUpload(e.target.files?.[0] ?? null)}
                className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-[var(--ink)] file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:tracking-[0.1em] file:text-white`}
                disabled={imageUploading || submitting}
              />
              <span className="block text-xs leading-5 text-[var(--ink-muted)]">
                {imageUploading ? "Uploading image..." : "JPEG, PNG, WebP, or GIF up to 1.5 MB."}
              </span>
              {imageUploadError && (
                <span className="block rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {imageUploadError}
                </span>
              )}
            </div>

            <label className="space-y-1 md:col-span-2">
              <span className={labelClass}>Description</span>
              <textarea
                value={values.description}
                onChange={(e) => updateField("description", e.target.value)}
                className={`${inputClass} min-h-24`}
              />
            </label>

            <label className="space-y-1">
              <span className={labelClass}>Cultural</span>
              <select
                value={values.cultural}
                onChange={(e) => updateField("cultural", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select...</option>
                {CULTURES.map((cultural) => (
                  <option key={cultural} value={cultural}>
                    {cultural}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className={labelClass}>Holiday</span>
              <select
                value={values.holiday}
                onChange={(e) => updateField("holiday", e.target.value)}
                className={inputClass}
              >
                <option value="">None</option>
                {HOLIDAYS.map((holiday) => (
                  <option key={holiday} value={holiday}>
                    {holiday}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className={labelClass}>Category</span>
              <select
                value={values.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select...</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className={labelClass}>Prep Time (minutes)</span>
              <input
                value={values.prepTime}
                onChange={(e) => updateField("prepTime", e.target.value)}
                type="number"
                min={1}
                className={inputClass}
              />
            </label>
            </div>
          </section>

          <section className={`${sectionCardClass} space-y-3`} style={{ paddingInline: "clamp(14px, 2.2vw, 26px)" }}>
            <div className="flex items-center justify-between">
              <p className="font-sans-alt text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Ingredients</p>
              <button
                type="button"
                onClick={addIngredient}
                className="recipe-form-add-button rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] font-sans-alt font-bold uppercase tracking-[0.1em] text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {values.ingredients.map((ingredient, index) => (
                <div key={`ingredient-${index}`} className="recipe-form-row grid grid-cols-1 gap-2 rounded-xl border border-[var(--border)] p-3 sm:grid-cols-12 sm:items-center">
                  <input
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                    className="sm:col-span-3 rounded-lg border border-[var(--border)] px-3 py-2"
                    placeholder="Amount"
                  />
                  <input
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                    className="sm:col-span-3 rounded-lg border border-[var(--border)] px-3 py-2"
                    placeholder="Unit"
                  />
                  <input
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, "name", e.target.value)}
                    className="sm:col-span-5 rounded-lg border border-[var(--border)] px-3 py-2"
                    placeholder="Ingredient name"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="sm:col-span-1 rounded-lg border border-[var(--border)] px-2 py-2 text-xs"
                    aria-label={`Remove ingredient ${index + 1}`}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={`${sectionCardClass} space-y-3`} style={{ paddingInline: "clamp(14px, 2.2vw, 26px)" }}>
            <div className="flex items-center justify-between">
              <p className="font-sans-alt text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Steps</p>
              <button
                type="button"
                onClick={addStep}
                className="recipe-form-add-button rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] font-sans-alt font-bold uppercase tracking-[0.1em] text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {values.steps.map((step, index) => (
                <div key={`step-${index}`} className="recipe-form-row grid grid-cols-1 gap-2 rounded-xl border border-[var(--border)] p-3 sm:grid-cols-12 sm:items-start">
                  <textarea
                    value={step.instruction}
                    onChange={(e) => updateStep(index, e.target.value)}
                    className="sm:col-span-11 rounded-lg border border-[var(--border)] px-3 py-2 min-h-20"
                    placeholder={`Step ${index + 1} instruction`}
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="sm:col-span-1 rounded-lg border border-[var(--border)] px-2 py-2 text-xs"
                    aria-label={`Remove step ${index + 1}`}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={`${sectionCardClass} space-y-3`} style={{ paddingInline: "clamp(14px, 2.2vw, 26px)" }}>
            <div className="flex items-center justify-between">
              <p className="font-sans-alt text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Family Notes (Optional)</p>
              <button
                type="button"
                onClick={addNote}
                className="recipe-form-add-button rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] font-sans-alt font-bold uppercase tracking-[0.1em] text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {values.notes.map((note, index) => (
                <div key={`note-${index}`} className="recipe-form-row grid grid-cols-1 gap-2 rounded-xl border border-[var(--border)] p-3 sm:grid-cols-12 sm:items-start">
                  <input
                    value={note.author}
                    onChange={(e) => updateNote(index, "author", e.target.value)}
                    className="sm:col-span-3 rounded-lg border border-[var(--border)] px-3 py-2"
                    placeholder="Author"
                  />
                  <textarea
                    value={note.content}
                    onChange={(e) => updateNote(index, "content", e.target.value)}
                    className="sm:col-span-8 rounded-lg border border-[var(--border)] px-3 py-2 min-h-16"
                    placeholder="Note"
                  />
                  <button
                    type="button"
                    onClick={() => removeNote(index)}
                    className="sm:col-span-1 rounded-lg border border-[var(--border)] px-2 py-2 text-xs"
                    aria-label={`Remove note ${index + 1}`}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div
            className="recipe-form-footer sticky bottom-0 z-10 -mx-6 border-t border-[var(--border)] px-6 pt-4 pb-3 backdrop-blur-sm md:-mx-8 md:px-8"
            style={{
              marginInline: `calc(${horizontalPad} * -1)`,
              paddingInline: horizontalPad,
            }}
          >
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="recipe-form-cancel-button rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-sans-alt font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_10px_20px_rgba(217,106,39,0.35)] transition hover:brightness-110 disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Saving..." : mode === "create" ? "Create Recipe" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={
          triggerClassName ??
          "inline-flex items-center justify-center rounded-full bg-[var(--ink)] px-4 py-2 text-[11px] font-sans-alt font-extrabold uppercase tracking-[0.14em] text-white"
        }
      >
        {triggerLabel}
      </button>

      {modalContent && typeof document !== "undefined" ? createPortal(modalContent, document.body) : null}
    </>
  );
}

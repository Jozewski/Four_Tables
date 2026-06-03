"use client";

import { useState } from "react";

const cultureColor: Record<string, string> = {
  Italian: "var(--italian)",
  Dutch:   "var(--dutch)",
  German:  "var(--german)",
  Mexican: "var(--mexican)",
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

type Props = {
  cultural: string;
  ingredients: Ingredient[];
  steps: Step[];
  notes: FamilyNote[];
};

export default function RecipeDetail({ cultural, ingredients, steps, notes }: Props) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "steps" | "notes">("ingredients");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const color = cultureColor[cultural] ?? "var(--ink)";

  function toggleStep(stepNumber: number) {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepNumber)) next.delete(stepNumber);
      else next.add(stepNumber);
      return next;
    });
  }

  const tabs = [
    { key: "ingredients", label: `Ingredients (${ingredients.length})` },
    { key: "steps",       label: `Steps (${steps.length})` },
    { key: "notes",       label: `Family Notes (${notes.length})` },
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-5 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="rounded-full border px-4 py-2.5 font-sans-alt text-xs font-extrabold tracking-[0.15em] uppercase transition-all"
            style={{
              borderColor: activeTab === tab.key ? color : "var(--border)",
              backgroundColor: activeTab === tab.key ? color : "var(--surface)",
              color: activeTab === tab.key ? "white" : "var(--ink-muted)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "ingredients" && (
        <div className="fade-up">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)] px-5 md:px-6">
            {ingredients
              .sort((a, b) => a.order - b.order)
              .map((ing) => (
                <div key={ing.id} className="ingredient-row py-3">
                  <span className="font-sans-alt text-sm font-semibold text-[var(--ink-soft)] text-right pr-4">
                    {ing.amount}
                    {ing.unit ? ` ${ing.unit}` : ""}
                  </span>
                  <span className="font-body text-sm text-[var(--ink)]">{ing.name}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === "steps" && (
        <div className="fade-up space-y-1">
          <p className="font-sans-alt text-[10px] font-extrabold tracking-[0.2em] uppercase text-[var(--ink-muted)] mb-6">
            Tap a step to mark it complete
          </p>
          {steps
            .sort((a, b) => a.stepNumber - b.stepNumber)
            .map((step) => {
              const done = completedSteps.has(step.stepNumber);
              return (
                <button
                  key={step.id}
                  onClick={() => toggleStep(step.stepNumber)}
                  className="step-block w-full text-left p-5 transition-colors rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--cream-dark)]"
                  style={{ opacity: done ? 0.45 : 1 }}
                >
                  <span
                    className="font-display text-2xl font-bold leading-none mt-0.5 flex-shrink-0"
                    style={{ color: done ? "var(--ink-muted)" : color }}
                  >
                    {String(step.stepNumber).padStart(2, "0")}
                  </span>
                  <p
                    className="font-body text-[0.95rem] leading-relaxed text-[var(--ink)]"
                    style={{ textDecoration: done ? "line-through" : "none" }}
                  >
                    {step.instruction}
                  </p>
                </button>
              );
            })}

          {completedSteps.size === steps.length && steps.length > 0 && (
            <div className="text-center py-10 fade-up">
              <p className="font-display text-2xl text-[var(--ink-soft)]">
                All steps complete. Enjoy your meal.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "notes" && (
        <div className="fade-up space-y-6">
          {notes.map((note) => (
            <blockquote
              key={note.id}
              className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-6 py-5"
              style={{ borderColor: color }}
            >
              <p className="font-body text-base italic text-[var(--ink-soft)] leading-relaxed mb-3">
                &ldquo;{note.content}&rdquo;
              </p>
              <footer className="font-sans-alt text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--ink-muted)]">
                — {note.author}
              </footer>
            </blockquote>
          ))}
          {notes.length === 0 && (
            <p className="font-body text-sm text-[var(--ink-muted)] italic">
              No family notes have been added to this recipe yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

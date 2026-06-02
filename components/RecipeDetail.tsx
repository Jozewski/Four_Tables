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
      {/* Tab bar */}
      <div className="flex border-b border-[var(--border)] mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="font-sans-alt text-xs tracking-[0.15em] uppercase px-6 py-3 transition-all border-b-2 -mb-px"
            style={{
              borderBottomColor: activeTab === tab.key ? color : "transparent",
              color: activeTab === tab.key ? color : "var(--ink-muted)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ingredients */}
      {activeTab === "ingredients" && (
        <div className="fade-up">
          <div className="divide-y divide-[var(--border)]">
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

      {/* Steps */}
      {activeTab === "steps" && (
        <div className="fade-up space-y-1">
          <p className="font-sans-alt text-[10px] tracking-[0.2em] uppercase text-[var(--ink-muted)] mb-6">
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
                  className="step-block w-full text-left p-4 transition-colors rounded-sm hover:bg-[var(--cream-dark)]"
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
              <p className="font-display text-2xl italic text-[var(--ink-soft)]">
                All steps complete. Enjoy your meal.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {activeTab === "notes" && (
        <div className="fade-up space-y-6">
          {notes.map((note) => (
            <blockquote
              key={note.id}
              className="border-l-4 pl-6 py-1"
              style={{ borderColor: color }}
            >
              <p className="font-body text-base italic text-[var(--ink-soft)] leading-relaxed mb-3">
                &ldquo;{note.content}&rdquo;
              </p>
              <footer className="font-sans-alt text-[11px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">
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

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import RecipeInlineListItem from "@/components/RecipeInlineListItem";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const recipe = {
  id: 42,
  title: "Sunday Sauce",
  description: "Slow simmered tomato sauce.",
  cultural: "Italian",
  holiday: "Christmas",
  category: "Main",
  prepTime: 180,
  imageUrl: "",
  archivedAt: null,
  ingredients: [{ id: 1, order: 1, amount: "2", unit: "cups", name: "tomatoes" }],
  steps: [{ id: 1, stepNumber: 1, instruction: "Simmer sauce." }],
  notes: [{ id: 1, author: "Grandma Louise", content: "Keep it low." }],
};

afterEach(() => {
  cleanup();
});

describe("RecipeInlineListItem contributor controls", () => {
  it("hides edit and archive actions from public visitors", () => {
    render(<RecipeInlineListItem recipe={recipe} canContribute={false} />);

    expect(screen.getByRole("link", { name: "Open Recipe" })).toBeDefined();
    expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Archive Sunday Sauce" })).toBeNull();
  });

  it("shows edit and archive actions to contributors", () => {
    render(<RecipeInlineListItem recipe={recipe} canContribute />);

    expect(screen.getByRole("button", { name: "Edit" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Archive Sunday Sauce" })).toBeDefined();
  });
});

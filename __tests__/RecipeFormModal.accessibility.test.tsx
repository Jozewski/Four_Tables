import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import axe from "axe-core";
import RecipeFormModal from "@/components/RecipeFormModal";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("RecipeFormModal accessibility", () => {
  it("has no detectable WCAG A/AA accessibility violations when the create dialog is open", async () => {
    render(<RecipeFormModal mode="create" triggerLabel="Add Recipe" />);

    fireEvent.click(screen.getByRole("button", { name: "Add Recipe" }));

    const dialog = await screen.findByRole("dialog");
    const results = await axe.run(dialog, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
    });

    expect(results.violations).toEqual([]);
  });
});

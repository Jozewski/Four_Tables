import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";

const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  refreshMock.mockClear();
});

describe("DeleteRecipeButton", () => {
  it("does not delete when confirmation is cancelled", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<DeleteRecipeButton recipeId={42} recipeTitle="Sunday Sauce" />);

    fireEvent.click(screen.getByRole("button", { name: "Delete Sunday Sauce" }));

    expect(window.confirm).toHaveBeenCalledWith('Delete "Sunday Sauce"? This cannot be undone.');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("deletes after confirmation and refreshes the current page", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, id: 42 }),
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<DeleteRecipeButton recipeId={42} recipeTitle="Sunday Sauce" />);

    fireEvent.click(screen.getByRole("button", { name: "Delete Sunday Sauce" }));

    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalledOnce();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/recipes/42", { method: "DELETE" });
  });
});

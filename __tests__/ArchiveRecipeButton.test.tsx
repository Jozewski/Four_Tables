import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ArchiveRecipeButton from "@/components/ArchiveRecipeButton";

const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  refreshMock.mockClear();
});

describe("ArchiveRecipeButton", () => {
  it("opens a confirmation modal before archiving", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<ArchiveRecipeButton recipeId={42} recipeTitle="Sunday Sauce" />);

    fireEvent.click(screen.getByRole("button", { name: "Archive Sunday Sauce" }));

    expect(screen.getByRole("dialog", { name: "Archive recipe" })).toBeDefined();
    expect(screen.getByText("Sunday Sauce")).toBeDefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("archives after modal confirmation and refreshes the current page", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, id: 42 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ArchiveRecipeButton recipeId={42} recipeTitle="Sunday Sauce" />);

    fireEvent.click(screen.getByRole("button", { name: "Archive Sunday Sauce" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm archive" }));

    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalledOnce();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/recipes/42/archive", { method: "PATCH" });
  });
});

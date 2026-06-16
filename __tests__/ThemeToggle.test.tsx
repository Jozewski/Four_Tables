import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ThemeToggle from "@/components/ThemeToggle";

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemeToggle", () => {
  it("toggles the document theme and persists the choice", () => {
    render(<ThemeToggle />);

    const toggle = screen.getByRole("button", { name: "Toggle color theme" });
    expect(screen.queryByText("Sun")).toBeNull();
    expect(screen.queryByText("Moon")).toBeNull();

    fireEvent.click(toggle);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("four-tables-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Toggle color theme" })).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Toggle color theme" }));

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("four-tables-theme")).toBe("light");
  });
});

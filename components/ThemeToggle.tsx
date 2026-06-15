"use client";

import { useEffect, useState } from "react";

const storageKey = "four-tables-theme";

type Theme = "light" | "dark";
type IconProps = {
  className?: string;
};

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem(storageKey);
  if (saved === "light" || saved === "dark") return saved;

  if (typeof window.matchMedia !== "function") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(storageKey, theme);
}

function SunIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.9 14.7A8 8 0 0 1 9.3 3.1 7 7 0 1 0 20.9 14.7Z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle ${isDark ? "theme-toggle-dark" : "theme-toggle-light"}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-toggle-icon theme-toggle-icon-sun">
        <SunIcon className="h-4 w-4" />
      </span>
      <span aria-hidden="true" className="theme-toggle-track">
        <span className="theme-toggle-thumb" />
      </span>
      <span className="theme-toggle-icon theme-toggle-icon-moon">
        <MoonIcon className="h-4 w-4" />
      </span>
    </button>
  );
}

import { useEffect, useState } from "preact/hooks";

type Theme = "light" | "dark";

function getTheme(): Theme {
  try {
    const value = localStorage.getItem("themePreference");
    if (value === "light" || value === "dark") return value;
  } catch {
    // Use the dark default when storage is unavailable.
  }
  return "dark";
}

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = "explicit";
  try {
    localStorage.setItem("themePreference", theme);
  } catch {
    // Theme preference remains active for this page even when storage is unavailable.
  }
}

export default function ThemeToggle() {
  const [theme, setCurrentTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const initial = getTheme();
    setCurrentTheme(initial);
    setTheme(initial);
  }, []);

  return (
    <button
      class="theme-toggle"
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      onClick={() => {
        const next = theme === "light" ? "dark" : "light";
        setCurrentTheme(next);
        setTheme(next);
      }}
    >
      {theme === "dark" ? "Prefer light mode?" : "Prefer dark mode?"}
    </button>
  );
}

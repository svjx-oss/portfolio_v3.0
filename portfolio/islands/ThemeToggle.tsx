import { useEffect, useState } from "preact/hooks";
import {
  applyTheme,
  readStoredTheme,
  resolveTheme,
  type Theme,
} from "@/lib/shared/theme.ts";

const analytics = globalThis as typeof globalThis & {
  gtag?: (...args: unknown[]) => void;
};

export default function ThemeToggle() {
  const [theme, setCurrentTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "dark";
    return resolveTheme(document.documentElement.dataset.theme ?? null);
  });

  useEffect(() => {
    const initial = readStoredTheme();
    setCurrentTheme(initial);
    applyTheme(initial);
  }, []);

  return (
    <button
      class="theme-toggle"
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      onClick={() => {
        const next = theme === "light" ? "dark" : "light";
        setCurrentTheme(next);
        applyTheme(next);
        analytics.gtag?.("event", "theme_change", { theme: next });
      }}
    >
      {theme === "dark" ? "Prefer light mode?" : "Prefer dark mode?"}
    </button>
  );
}

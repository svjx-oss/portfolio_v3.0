export type Theme = "light" | "dark";

export const themeColors = {
  dark: "#0C111A",
  light: "#F2F6FD",
} as const satisfies Record<Theme, string>;

const THEME_STORAGE_KEY = "themePreference";

export function resolveTheme(value: string | null): Theme {
  return value === "light" || value === "dark" ? value : "dark";
}

export function readStoredTheme(): Theme {
  try {
    return resolveTheme(
      globalThis.localStorage?.getItem(THEME_STORAGE_KEY) ?? null,
    );
  } catch {
    return "dark";
  }
}

export function applyTheme(theme: Theme) {
  const root = globalThis.document?.documentElement;
  if (root) {
    root.dataset.theme = theme;
    root.dataset.themePreference = "explicit";
  }
  try {
    globalThis.localStorage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Preference remains active for this page even when storage is unavailable.
  }
}

// Inline pre-paint initializer. Keep its resolution identical to resolveTheme().
export const themeInitScript =
  `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}");` +
  `document.documentElement.dataset.theme=p==="light"||p==="dark"?p:"dark"` +
  `}catch(e){document.documentElement.dataset.theme="dark"}})();`;

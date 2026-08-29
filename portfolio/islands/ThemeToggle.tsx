import { useEffect, useState } from "preact/hooks";

type Preference = "system" | "light" | "dark";

const preferences: Preference[] = ["system", "light", "dark"];

function resolveTheme(preference: Preference) {
  return preference === "system"
    ? (globalThis.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light")
    : preference;
}

function getPreference(): Preference {
  try {
    const value = localStorage.getItem("themePreference");
    return preferences.includes(value as Preference)
      ? value as Preference
      : "system";
  } catch {
    return "system";
  }
}

function setTheme(preference: Preference) {
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.theme = resolveTheme(preference);
  try {
    localStorage.setItem("themePreference", preference);
  } catch {
    // Theme preference remains active for this page even when storage is unavailable.
  }
}

export default function ThemeToggle() {
  const [preference, setPreference] = useState<Preference>("system");

  useEffect(() => {
    const initial = getPreference();
    setPreference(initial);
    setTheme(initial);
    const media = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (document.documentElement.dataset.themePreference === "system") {
        setTheme("system");
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const next =
    preferences[(preferences.indexOf(preference) + 1) % preferences.length];
  return (
    <button
      class="icon-control"
      type="button"
      aria-label={`Theme: ${preference}. Activate for ${next} theme.`}
      onClick={() => {
        setPreference(next);
        setTheme(next);
      }}
    >
      <span aria-hidden="true">
        {preference === "system" ? "◐" : preference === "light" ? "☀" : "◒"}
      </span>
    </button>
  );
}

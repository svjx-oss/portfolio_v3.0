import { resolveTheme, themeInitScript } from "@/lib/shared/theme.ts";

Deno.test("resolveTheme accepts light and dark preferences", () => {
  if (resolveTheme("light") !== "light") throw new Error("Expected light");
  if (resolveTheme("dark") !== "dark") throw new Error("Expected dark");
});

Deno.test("resolveTheme defaults unknown preferences to dark", () => {
  for (const value of [null, "system", "blue", ""]) {
    if (resolveTheme(value) !== "dark") {
      throw new Error(`Expected dark for ${value}`);
    }
  }
});

Deno.test("theme init script resolves only light and dark", () => {
  if (!themeInitScript.includes('p==="light"||p==="dark"?p:"dark"')) {
    throw new Error("Init script does not match resolveTheme rules");
  }
  if (
    !themeInitScript.includes(
      'catch(e){document.documentElement.dataset.theme="dark"}',
    )
  ) {
    throw new Error("Init script does not fall back to dark");
  }
  if (!themeInitScript.includes("themePreference")) {
    throw new Error("Init script does not read the stored preference");
  }
});

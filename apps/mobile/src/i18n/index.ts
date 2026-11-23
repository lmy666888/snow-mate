import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { en, zh } from "./resources";
const i18n = createInstance();
void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, zh: { translation: zh } },
  lng: "en",
  fallbackLng: "en",
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  initAsync: false,
});
/** Phrase keys keep legacy prototype screens localizable through shared UI primitives. User-owned content opts out at the AppText boundary with localize=false. */
export function tr(value: string): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!/[A-Za-z\u3400-\u9fff]/.test(normalized)) return value;
  if (Object.hasOwn(en, normalized)) return i18n.t(normalized);
  const patterns: [RegExp, string, string[]][] = [
    [
      /^Snowmate (M[0-9.]+) · Development$/,
      "Snowmate {{milestone}} · Development",
      ["milestone"],
    ],
    [/^Meet (.+)\.$/, "Meet {{name}}.", ["name"]],
    [/^View (.+) offer$/, "View {{name}} offer", ["name"]],
    [/^View (.+)$/, "View {{name}}", ["name"]],
    [/^Chat with (.+)$/, "Chat with {{name}}", ["name"]],
  ];
  for (const [pattern, key, fields] of patterns) {
    const match = normalized.match(pattern);
    if (match)
      return i18n.t(
        key,
        Object.fromEntries(fields.map((f, i) => [f, match[i + 1]])),
      );
  }
  return value;
}
export default i18n;

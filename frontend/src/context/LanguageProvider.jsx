import { useCallback, useMemo, useState } from "react";
import {
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  translations,
} from "../i18n/translations.js";
import { LanguageContext } from "./language-context.js";

const FALLBACK_LANGUAGE = "en";

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES[stored]) {
      return stored;
    }
  } catch {
    // Ignore storage access errors and fallback to EN.
  }
  return FALLBACK_LANGUAGE;
}

function resolvePath(object, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], object);
}

function interpolate(template, values = {}) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback((nextLanguage) => {
    if (!SUPPORTED_LANGUAGES[nextLanguage]) return;

    setLanguageState(nextLanguage);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // Ignore storage write errors.
    }
  }, []);

  const t = useCallback(
    (path, values = {}) => {
      const current = resolvePath(translations[language], path);
      const fallback = resolvePath(translations[FALLBACK_LANGUAGE], path);
      const message = typeof current === "string"
        ? current
        : typeof fallback === "string"
          ? fallback
          : path;

      return interpolate(message, values);
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      t,
    }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";
import type { Language } from "@/i18n";

// ---------- types ----------
interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// ---------- helpers ----------
const dictionaries: Record<Language, Record<string, unknown>> = {
  en: en as unknown as Record<string, unknown>,
  es: es as unknown as Record<string, unknown>,
};

/** Resolve a dot-notation key like "nav.scanner" from the active dictionary */
function resolve(dict: Record<string, unknown>, key: string): string {
  const parts = key.split(".");
  let cursor: unknown = dict;
  for (const part of parts) {
    if (cursor == null || typeof cursor !== "object") return key;
    cursor = (cursor as Record<string, unknown>)[part];
  }
  return typeof cursor === "string" ? cursor : key;
}

function detectInitialLanguage(): Language {
  const stored = localStorage.getItem("caldi_lang");
  if (stored === "en" || stored === "es") return stored;
  const browser = navigator.language?.slice(0, 2).toLowerCase();
  return browser === "es" ? "es" : "en";
}

// ---------- context ----------
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem("caldi_lang", lang);
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string) => resolve(dictionaries[language], key),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}

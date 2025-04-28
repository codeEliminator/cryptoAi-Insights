import { ReactNode } from "react";
import AppLocale from "../../locales/AppLocale";
import { LocalizationData } from "@/app/types/LocalizationData";

export type LanguageKey = keyof typeof AppLocale;
export interface LanguageStore {
  language: LanguageKey;
  
  initializeLanguage(): void;
  setLanguage(newLanguage: LanguageKey): void;
  
  readonly locale: LocalizationData;
}

export interface LanguageProviderProps {
  children: ReactNode;
}
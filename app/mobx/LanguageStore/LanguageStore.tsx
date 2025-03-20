import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { makeAutoObservable, runInAction } from "mobx";
import AppLocale from "../../locales/AppLocale";
import { observer } from 'mobx-react-lite';
import { getLocales } from 'expo-localization';
import { LocalizationData } from "@/app/types/LocalizationData";

type LanguageKey = keyof typeof AppLocale;

class LanguageStore {
  language: LanguageKey = 'en';

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true, 
    });

    this.initializeLanguage();
  }

  initializeLanguage() {
    try {
      const locales = getLocales();
      const userDefaultLanguage = locales[0]?.languageCode;
      
      if (userDefaultLanguage && userDefaultLanguage in AppLocale) {
        this.setLanguage(userDefaultLanguage as LanguageKey);
      }
    } catch (error) {
      console.error("Failed to initialize language:", error);
    }
  }

  setLanguage(newLanguage: LanguageKey) {
    runInAction(() => {
      this.language = newLanguage;
    });
  }

  get locale(): LocalizationData {
    return AppLocale[this.language];
  }
}

const languageStore = new LanguageStore();
const LanguageContext = createContext<LanguageStore>(languageStore);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = observer(({ children }) => {
  useEffect(() => {
    languageStore.initializeLanguage();
  }, []);

  return (
    <LanguageContext.Provider value={languageStore}>
      {children}
    </LanguageContext.Provider>
  );
});

export const useLanguage = (): LanguageStore => useContext(LanguageContext);

export default languageStore;
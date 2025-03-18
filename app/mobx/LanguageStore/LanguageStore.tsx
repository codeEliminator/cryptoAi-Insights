// LanguageStore.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { makeAutoObservable, computed, runInAction } from "mobx";
import AppLocale from "../../locales/AppLocale";
import { useLocalObservable, observer,  } from 'mobx-react-lite';

type LanguageKey = keyof typeof AppLocale;
interface Locale {
  [key: string]: any;
}

class LanguageStore {
  language: LanguageKey = "en";

  constructor() {
    makeAutoObservable(this, {}, {
      autoBind: true, 
    });
  }

  setLanguage(newLanguage: LanguageKey) {
    runInAction(() => {
      this.language = newLanguage;
    });
  }

  get locale(): Locale {
    console.log('getting locale for', this.language);
    return AppLocale[this.language];
  }
}

const languageStore = new LanguageStore();
const LanguageContext = createContext<LanguageStore>(languageStore);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = observer(({ children }) => {
  return (
    <LanguageContext.Provider value={languageStore}>
      {children}
    </LanguageContext.Provider>
  );
});

export const useLanguage = (): LanguageStore => useContext(LanguageContext);

export default languageStore;

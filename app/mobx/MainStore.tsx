import React, { createContext, useContext, ReactNode } from "react";
import { makeAutoObservable } from "mobx";
import languageStore from "./LanguageStore/LanguageStore";
import { LanguageStore } from "./LanguageStore/types";
import walletStore from "./WalletStore/WalletStore";
import { WalletStore } from "./WalletStore/types";

class MainStore {
  languageStore: LanguageStore;
  walletStore: WalletStore;

  constructor() {
    this.languageStore = languageStore;
    this.walletStore = walletStore;
    
    makeAutoObservable(this, {}, {
      autoBind: true,
    });
  }
}

const mainStore = new MainStore();

const MainStoreContext = createContext<MainStore>(mainStore);

interface MainStoreProviderProps {
  children: ReactNode;
}

export const MainStoreProvider: React.FC<MainStoreProviderProps> = ({ children }) => {
  return (
    <MainStoreContext.Provider value={mainStore}>
      {children}
    </MainStoreContext.Provider>
  );
};


export const useStore = (): MainStore => useContext(MainStoreContext);


export const useLanguageStore = (): LanguageStore => useContext(MainStoreContext).languageStore;

export const useWalletStore = (): WalletStore => useContext(MainStoreContext).walletStore;

export default mainStore;
import { makeAutoObservable, runInAction } from 'mobx';
import { createContext, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { CryptoCurrency } from '../../types/types';
import { ICryptoStore } from './types';

class CryptoStore implements ICryptoStore {
  cryptoData: CryptoCurrency[] = [];
  loading = true;
  refreshing = false;
  error: string | null = null;

  page = 1;
  hasMore = true;

  lastFetchTime: number | null = null;
  marketTrend: 'up' | 'down' | 'neutral' = 'neutral';
  constructor() {
    makeAutoObservable(this);
    this.fetchCryptoData(true, false);
  }

  fetchCryptoData = async (isInitialLoad = false, forceRefresh = false) => {
    const CACHE_DURATION = 5 * 60 * 1000;
    const now = Date.now();
    if (
      !forceRefresh &&
      !isInitialLoad &&
      this.cryptoData.length > 0 &&
      this.lastFetchTime &&
      now - this.lastFetchTime < CACHE_DURATION
    ) {
      return this.cryptoData;
    }
    if (isInitialLoad && !forceRefresh) {
      this.loading = true;
      this.page = 1;
      this.error = null;
    }
    try {
      const response = await axios.get<CryptoCurrency[]>(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 200,
            page: isInitialLoad || forceRefresh ? 1 : this.page,
            sparkline: false,
            price_change_percentage: '24h',
          },
        }
      );
      runInAction(() => {
        if (isInitialLoad || forceRefresh) {
          this.cryptoData = response.data;
        } else {
          this.cryptoData = [...this.cryptoData, ...response.data];
        }

        this.lastFetchTime = now;
        this.hasMore = response.data.length === 200;

        this.calculateMarketTrend();

        this.loading = false;
        this.refreshing = false;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        this.loading = false;
        this.refreshing = false;
      });

      console.error('Error fetching crypto data:', error);
      return null;
    }
  };
  async loadMore() {
    if (this.loading || !this.hasMore) return;

    this.page += 1;
    await this.fetchCryptoData(false);
  }

  async refresh() {
    this.refreshing = true;
    await this.fetchCryptoData(true, true);
  }

  calculateMarketTrend() {
    if (this.cryptoData.length === 0) {
      this.marketTrend = 'neutral';
      return;
    }

    const avgChange =
      this.cryptoData.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) /
      this.cryptoData.length;

    this.marketTrend = avgChange > 1 ? 'up' : avgChange < -1 ? 'down' : 'neutral';
  }
}

const cryptoStore = new CryptoStore();
const CryptoContext = createContext<CryptoStore>(cryptoStore);

interface CryptoProviderProps {
  children: React.ReactNode;
}

export const CryptoProvider: React.FC<CryptoProviderProps> = observer(({ children }) => {
  useEffect(() => {
    cryptoStore.fetchCryptoData(true, false);
  }, []);

  return <CryptoContext.Provider value={cryptoStore}>{children}</CryptoContext.Provider>;
});

export const useCrypto = () => useContext(CryptoContext);

export default cryptoStore;

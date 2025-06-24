import { CryptoCurrency } from '@/app/types/types';

export interface ICryptoStore {
  cryptoData: CryptoCurrency[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  lastFetchTime: number | null;
  marketTrend: 'up' | 'down' | 'neutral';
  fetchCryptoData: (
    isInitialLoad?: boolean,
    forceRefresh?: boolean
  ) => Promise<CryptoCurrency[] | null | undefined>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  calculateMarketTrend: () => void;
}

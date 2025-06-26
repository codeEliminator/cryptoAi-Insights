import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CryptoCurrency } from '../../types/types';
import { ICryptoStore } from './types';
import getUniqueId from '../../helpers/getUniqueId';

class CryptoStore implements ICryptoStore {
  cryptoData: CryptoCurrency[] = [];
  loading = true;
  refreshing = false;
  error: string | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000;
  page = 1;
  hasMore = true;

  lastFetchTime: number | null = null;
  marketTrend: 'up' | 'down' | 'neutral' = 'neutral';
  constructor() {
    makeAutoObservable(this);
    this._getData();
    this.fetchCryptoData(true, false);
  }

  _getData = async () => {
    try {
      const cryptoData = await AsyncStorage.getItem('cryptoData');
      if (cryptoData) {
        this.cryptoData = JSON.parse(cryptoData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  _storeData = async (cryptoData: CryptoCurrency[]) => {
    try {
      await AsyncStorage.setItem('cryptoData', JSON.stringify(cryptoData));
    } catch (error) {
      console.log(error);
    }
  };

  fetchCryptoData = async (isInitialLoad = false, forceRefresh = false, loadMore = false) => {
    const now = Date.now();
    if (
      !forceRefresh &&
      !isInitialLoad &&
      this.cryptoData.length > 0 &&
      this.lastFetchTime &&
      now - this.lastFetchTime < this.CACHE_DURATION &&
      !loadMore
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
        const data = response.data.map(item => ({
          ...item,
          uuid: getUniqueId(),
        }));
        if (isInitialLoad || forceRefresh) {
          this.cryptoData = data;
        } else {
          this.cryptoData = [...this.cryptoData, ...data];
        }
        this._storeData(this.cryptoData);

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

      return null;
    }
  };
  loadMore = async () => {
    if (this.loading || !this.hasMore) return;

    this.page += 1;
    await this.fetchCryptoData(false, false, true);
  };

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

export default cryptoStore;

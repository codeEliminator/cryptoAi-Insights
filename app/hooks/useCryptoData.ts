import { useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import { CryptoCurrency } from '../types/types';
import { useLanguage } from '../mobx/LanguageStore/LanguageStore';

const MIN_REQUEST_INTERVAL = 5000;

export const useCryptoData = (
  setCryptoData: (data: CryptoCurrency[]) => void,
  setMarketTrend: (trend: 'up' | 'down' | 'neutral') => void,
  setLoading: (loading: boolean) => void,
  setRefreshing: (refreshing: boolean) => void,
  page: number,
  refreshing: boolean
) => {
  const { language } = useLanguage();
  const isRequestPending = useRef(false);
  const lastRequestTime = useRef(0);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString(language + '-' + language.toUpperCase(), { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, [language]);


  const axiosInstance = useMemo(() => axios.create({ timeout: 60000 }), []);
  
  const fetchCryptoData = useCallback(async (forceRefresh = false) => {
    if (isRequestPending.current) return;
    
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    
    if (!forceRefresh && timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
      throttleTimeout.current = setTimeout(() => fetchCryptoData(true), MIN_REQUEST_INTERVAL - timeSinceLastRequest);
      return;
    }
    
    isRequestPending.current = true;
    if (!refreshing) setLoading(true);
    
    try {
      const response = await axiosInstance.get<CryptoCurrency[]>('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page,
          sparkline: false,
          price_change_percentage: '24h'
        }
      });
      
      setCryptoData(response.data);
      const avgChange = response.data.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) / response.data.length;
      setMarketTrend(avgChange > 1 ? 'up' : avgChange < -1 ? 'down' : 'neutral');
      lastRequestTime.current = Date.now();
    } catch (error) {
      console.error(axios.isAxiosError(error) && error.response?.status === 429
        ? 'Error 429: Too many requests. API rate limit exceeded.'
        : 'Error fetching crypto data:', error);
    } finally {
      isRequestPending.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosInstance, refreshing, page, setCryptoData, setMarketTrend, setLoading, setRefreshing]);

  return { formattedDate, fetchCryptoData };
};
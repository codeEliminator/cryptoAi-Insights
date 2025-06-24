import { useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import { CryptoCurrency } from '../types/types';

const MIN_REQUEST_INTERVAL = 5000;

export const useCryptoData = (
  setLoading: (loading: boolean) => void,
  setRefreshing: (refreshing: boolean) => void,
  page: number,
  refreshing: boolean
) => {
  const isRequestPending = useRef(false);
  const lastRequestTime = useRef(0);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  const axiosInstance = useMemo(() => axios.create({ timeout: 60000 }), []);

  const fetchCryptoData = useCallback(
    async (forceRefresh = false) => {
      if (isRequestPending.current) return;

      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;

      if (!forceRefresh && timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
        throttleTimeout.current = setTimeout(
          () => fetchCryptoData(true),
          MIN_REQUEST_INTERVAL - timeSinceLastRequest
        );
        return;
      }

      isRequestPending.current = true;
      if (!refreshing) setLoading(true);

      try {
        const response = await axiosInstance.get<CryptoCurrency[]>(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 200,
              page: page,
              sparkline: false,
              price_change_percentage: '24h',
            },
          }
        );
        lastRequestTime.current = Date.now();
        return response.data;
      } catch (error) {
        console.error(
          axios.isAxiosError(error) && error.response?.status === 429
            ? 'Error 429: Too many requests. API rate limit exceeded.'
            : 'Error fetching crypto data:',
          error
        );
      } finally {
        isRequestPending.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [axiosInstance, refreshing, page, setLoading, setRefreshing]
  );

  return { fetchCryptoData };
};

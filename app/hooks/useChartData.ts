import { useCallback } from 'react';
import useLocalizedDays from '../helpers/getLocalizedDays';
import useLocalizedMonths from '../helpers/getLocalizedMonths';
import axios from 'axios';

interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
}

interface ChartDataProps {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setChartData: (data: ChartData) => void;
  coinId: string;
  timeframe: string;
  FakeCoinChartData: any;
}

const formatChartData = (
  prices: [number, number][],
  timeframe: string,
  localizedDays: string[],
  localizedMonths: string[]
): ChartData => {
  const maxLabels = 10;
  const step = Math.ceil(prices.length / maxLabels);

  const priceData = prices.map(([_, price]) => price);
  const labels: string[] = [];

  for (let i = 0; i < prices.length && labels.length < maxLabels; i += step) {
    const timestamp = prices[i][0];
    const date = new Date(timestamp);

    let label = '';
    if (timeframe === '1') {
      label = `${date.getHours()}:00`;
    } else if (timeframe === '7') {
      label = localizedDays[date.getDay()];
    } else if (timeframe === '30') {
      label = `${date.getDate()}/${date.getMonth() + 1}`;
    } else {
      label = localizedMonths[date.getMonth()];
    }

    labels.push(label);
  }

  const resampledData: number[] = [];

  for (let i = 0; i < labels.length; i++) {
    const startIdx = i * step;
    if (startIdx < priceData.length) {
      resampledData.push(priceData[startIdx]);
    }
  }

  return {
    labels,
    datasets: [{ data: resampledData }],
  };
};

const useChartData = ({
  setLoading,
  setError,
  setChartData,
  coinId,
  timeframe,
  FakeCoinChartData,
}: ChartDataProps) => {
  const localizedDays = useLocalizedDays();
  const localizedMonths = useLocalizedMonths();

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${timeframe}`
      );
      const prices: [number, number][] = response.data.prices;

      // const prices = FakeCoinChartData.prices;
      if (!prices || prices.length === 0) {
        throw new Error('Нет данных о ценах');
      }

      const chartData = formatChartData(prices, timeframe, localizedDays, localizedMonths);

      setChartData(chartData);
    } catch (err) {
      console.error('Ошибка при загрузке данных графика:', err);
      setError(
        err instanceof Error
          ? `Не удалось загрузить данные: ${err.message}`
          : 'Не удалось загрузить данные для графика'
      );
    } finally {
      setLoading(false);
    }
  }, [coinId, timeframe, FakeCoinChartData, setLoading, setError, setChartData]);

  return { fetchChartData };
};

export default useChartData;

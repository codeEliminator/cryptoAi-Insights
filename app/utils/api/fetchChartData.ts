import axios from "axios";
import { formatChartData } from "../../helpers/formatDates";
export const fetchChartData = async (coinId: string, timeframe: string, lang: string) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${timeframe}`
      );
      const prices: [number, number][] = response.data.prices;

      if (!prices || prices.length === 0) {
        throw new Error('Нет данных о ценах');
      }

      const chartData = formatChartData(prices, timeframe, lang);
      
      return chartData;
    } catch (err) {
      console.error('Error fetching chart data:', err);
      return new Error('Error fetching chart data');
    } 
};
import getLocalizedDays from "./getLocalizedDays";
import getLocalizedMonths from "./getLocalizedMonths";
import ChartData from "../types/ChartTypes";

export const formatChartData = (
  prices: [number, number][],
  timeframe: string,
  lang: string
): ChartData[] => {
  const maxLabels = 10;
  const step = Math.ceil(prices.length / maxLabels);
  const localizedDays = getLocalizedDays(lang);
  const localizedMonths = getLocalizedMonths(lang);

  const result: ChartData[] = [];

  for (let i = 0; i < prices.length && result.length < maxLabels; i += step) {
    const [timestamp, price] = prices[i];
    const date = new Date(timestamp);

    let label = '';
    switch (timeframe) {
      case '1':
        label = `${date.getHours()}:00`;
        break;
      case '7':
        label = localizedDays[date.getDay()];
        break;
      case '30':
        label = `${date.getDate()}/${date.getMonth() + 1}`;
        break;
      default:
        label = localizedMonths[date.getMonth()];
        break;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;

    result.push({
      value: price,
      date: formattedDate,
      label
    });
  }

  return result;
};
import { useMemo } from "react";
import { CryptoCurrency } from "../types/types";

export const useTrendingCoins = (cryptoData: CryptoCurrency[]) => {
  return useMemo(() => {
    if (!cryptoData.length) return { gainers: [], losers: [] };

    const gainers = cryptoData
      .filter((coin) => coin.price_change_percentage_24h > 0)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5);

    const losers = cryptoData
      .filter((coin) => coin.price_change_percentage_24h < 0)
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 5);

    return { gainers, losers };
  }, [cryptoData]);
};

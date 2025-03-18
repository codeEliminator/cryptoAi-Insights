export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export interface AIRecommendation {
  coinId: string;
  coinName: string;
  confidence: number;
  reason: string;
  action: 'buy' | 'sell' | 'hold';
}

export default {
  CryptoCurrency: {} as CryptoCurrency,
  AIRecommendation: {} as AIRecommendation
};

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
  action: 'buy' | 'sell' | 'hold' | 'N/A';
}
export interface AiRecommendationOptions {
  specificCoins?: string[];
  temperature?: number;
  maxTokens?: number;
  mockData?: boolean;
  cacheDuration?: number;
}
export interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  image: { large: string; };
  market_cap_rank: number;
  links: { homepage: string[]; };
  market_data: {
    current_price: { usd: number; };
    price_change_percentage_24h: number;
    market_cap: { usd: number; };
    total_volume: { usd: number; };
    high_24h: { usd: number; };
    low_24h: { usd: number; };
    total_supply: number;
    max_supply: number;
  };
  description: { en: string; };
  watchlist_portfolio_users: number;
}


export default {
  CryptoCurrency: {} as CryptoCurrency,
  AIRecommendation: {} as AIRecommendation,
  AiRecommendationOptions: {} as AiRecommendationOptions,
  CoinDetail: {} as CoinDetail,
};

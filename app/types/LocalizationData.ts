export interface LocalizationData {
  common: {
    loading: string;
    error: string;
    refresh: string;
    settings: string;
    save: string;
    languagePreferences: string;
    refreshed: string;
  };
  tabs: {
    home: string;
    market: string;
    ai: string;
    profile: string;
  };
  home: {
    title: string;
    marketHeatmap: string;
    topGainers: string;
    topLosers: string;
    aiRecommendations: string;
    viewMore: string;
    marketUp: string;
    marketDown: string;
    marketStable: string;
  };
  ai: {
    title: string;
    subtitle: string;
    confidence: string;
    timeframes: {
      day: string;
      week: string;
      month: string;
    };
    actions: {
      buy: string;
      sell: string;
      hold: string;
    };
    marketIndicators: string;
  };
  market: {
    title: string;
    marketCap: string;
    change24h: string;
    price: string;
  };
  crypto: {
    about: string;
    technicalAnalysis: string;
    marketCap: string;
    volume24h: string;
    high24h: string;
    low24h: string;
    aiAnalysis: string;
    marketOpen: string;
    pricingDisclaimer: string;
    statistics: string;
    marketCapRating: string;
    totalSupply: string;
    maxSupply: string;
    aiRecommendation: string;
    longPressForFullText: string;
    officialLink: string;
  };
}

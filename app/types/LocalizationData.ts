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
    welcomeMessage: string;
    errorMessage: string;
    marketIndicators: string;
    aiAssistant: string;
    chat: string;
    analysis: string;
    askAboutCrypto: string;
    noAnalysisAvailable: string;
    requestAnalysis: string;
    marketAnalysis: string;
    marketSentiment: string;
    topOpportunities: string;
    marketTrends: string;
    lastUpdated: string;
    veryBullish: string;
    bullish: string;
    bearish: string;
    veryBearish: string;
    loadingAnalysis: string;
    clearChat: string;
  };
  market: {
    title: string;
    marketCap: string;
    change24h: string;
    price: string;
    loadingMore: string;
    searchPlaceholder: string;
    noResults: string;
  };
  profile: {
    connectWallet: string;
    profile: string;
    connectWalletMessage: string;
    walletAddress: string;
    network: string;
    nativeBalance: string;
    tokens: string;
    noTokensFound: string;
    disconnectWallet: string;
    loading: string;
    switchToEthereum: string;
    switchToPolygon: string;
    createAWallet: string;
    entryTitles: string[];
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

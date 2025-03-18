import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios, { AxiosResponse } from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useLanguage } from '../mobx/LanguageStore/LanguageStore';

interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

interface AIRecommendation {
  coinId: string;
  coinName: string;
  confidence: number;
  reason: string;
  action: 'buy' | 'sell' | 'hold';
}

const aiRecommendations: AIRecommendation[] = [
  {
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    confidence: 87,
    reason: 'Повышенный объем транзакций и институциональный интерес',
    action: 'buy'
  },
  {
    coinId: 'ethereum',
    coinName: 'Ethereum',
    confidence: 75,
    reason: 'Рост активности в DeFi и недавнее обновление сети',
    action: 'hold'
  },
  {
    coinId: 'solana',
    coinName: 'Solana',
    confidence: 92,
    reason: 'Быстрорастущая экосистема и повышенная активность разработчиков',
    action: 'buy'
  }
];

const CoinItem = React.memo(({ coin, onPress }: { coin: CryptoCurrency; onPress?: () => void }) => {
  const isPositive = coin.price_change_percentage_24h >= 0;
  
  return (
    <TouchableOpacity 
      style={styles.coinItem}
      onPress={onPress}
    >
      <View style={styles.coinInfo}>
        <Text style={styles.coinSymbol}>{coin.symbol.toUpperCase()}</Text>
        <Text style={styles.coinName}>{coin.name}</Text>
      </View>
      <View style={styles.coinPriceInfo}>
        <Text style={styles.coinPrice}>${coin.current_price.toLocaleString()}</Text>
        <Text style={[styles.coinChange, { color: isPositive ? '#4CAF50' : '#FF6B6B' }]}>
          <Ionicons name={isPositive ? "arrow-up" : "arrow-down"} size={12} /> 
          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const HeatmapItem = React.memo(({ coin, onPress }: { coin: CryptoCurrency; onPress?: () => void }) => {
  const getBgColor = () => {
    const change = coin.price_change_percentage_24h;
    if (change > 2) return '#00A86B';
    else if (change > 0) return '#4CAF50';
    else if (change > -5) return '#FF6B6B';
    else return '#D32F2F';
  };
  
  return (
    <TouchableOpacity 
      style={[styles.heatmapItem, { backgroundColor: getBgColor() }]}
      onPress={onPress}
    >
      <Text style={styles.heatmapSymbol}>{coin.symbol.toUpperCase()}</Text>
      <Text style={styles.heatmapChange}>{coin.price_change_percentage_24h.toFixed(1)}%</Text>
    </TouchableOpacity>
  );
});

const RecommendationCard = React.memo(({ recommendation, onPress }: 
  { recommendation: AIRecommendation; onPress?: () => void }) => {
  const { locale } = useLanguage();
  
  const getActionColor = () => {
    switch(recommendation.action) {
      case 'buy': return '#4CAF50';
      case 'sell': return '#FF6B6B';
      default: return '#FFD700';
    }
  };
  
  const getActionText = () => {
    switch(recommendation.action) {
      case 'buy': return locale.ai.actions.buy;
      case 'sell': return locale.ai.actions.sell;
      default: return locale.ai.actions.hold;
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.recommendationCard}
      onPress={onPress}
    >
      <View style={styles.recommendationHeader}>
        <Text style={styles.recommendationCoin}>{recommendation.coinName}</Text>
        <View style={[styles.actionBadge, { backgroundColor: getActionColor() }]}>
          <Text style={styles.actionText}>{getActionText()}</Text>
        </View>
      </View>
      
      <Text style={styles.recommendationReason}>{recommendation.reason}</Text>
      
      <View style={styles.confidenceBar}>
        <View style={[styles.confidenceFill, { width: `${recommendation.confidence}%` }]} />
          <Text style={styles.confidenceText}>{locale.ai.confidence}: {recommendation.confidence}%</Text>
      </View>
    </TouchableOpacity>
  );
});

const HomeScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [cryptoData, setCryptoData] = useState<CryptoCurrency[]>([]);
  const [marketTrend, setMarketTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const { locale, language } = useLanguage();
  const isRequestPending = useRef(false);
  const lastRequestTime = useRef(0);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);
  const MIN_REQUEST_INTERVAL = 5000;
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString(language + '-' + language.toUpperCase(), { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, [language]);

  const axiosInstance = useMemo(() => axios.create({
    timeout: 10000, // 10 секунд таймаут для запросов
  }), []);
  
  const fetchCryptoData = useCallback(async (forceRefresh = false) => {
    if (isRequestPending.current) {
      console.log('Request already in progress, skipping...');
      return;
    }
    
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    
    if (!forceRefresh && timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const delayTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
      
      throttleTimeout.current = setTimeout(() => {
        throttleTimeout.current = null;
        fetchCryptoData(true);
      }, delayTime);
      
      return;
    }
    
    isRequestPending.current = true;
    if (!refreshing) setLoading(true);
    const getCryptoData = async (page: number): Promise<CryptoCurrency[]> => {
      const response = await axiosInstance.get<CryptoCurrency[]>(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 15,
            page: page,
            sparkline: false,
            price_change_percentage: '24h'
          }
        }
      );
      return response.data;
    };
    
    
    try {
      const response = await getCryptoData(page)
      setCryptoData(response);
      
      const avgChange = response.reduce(
        (sum: number, coin: CryptoCurrency) => sum + coin.price_change_percentage_24h, 
        0
      ) / response.length;
      
      if (avgChange > 1) {
        setMarketTrend('up');
      } else if (avgChange < -1) {
        setMarketTrend('down');
      } else {
        setMarketTrend('neutral');
      }
      
      lastRequestTime.current = Date.now();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        console.error('Error 429: Too many requests. API rate limit exceeded.'); //доработать
      } else {
        console.error('Error fetching crypto data:', error);
      }
    } finally {
      isRequestPending.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, [axiosInstance, refreshing]);

  useEffect(() => {
    fetchCryptoData();
    
    return () => {
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, [fetchCryptoData]);


  const onRefresh = useCallback(() => {
    if (isRequestPending.current) {
      console.log('Refresh skipped: request already in progress');
      return;
    }
    
    setRefreshing(true);
    fetchCryptoData(true);
  }, [fetchCryptoData]);


  const { gainers, losers } = useMemo(() => {
    if (!cryptoData.length) return { gainers: [], losers: [] };
    
    const gainers = [...cryptoData]
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5);
    
    const losers = [...cryptoData]
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 5);
      
    return { gainers, losers };
  }, [cryptoData]);


  const navigateToSettings = useCallback(() => {
    router.navigate('/screens/Settings');
  }, [router]);
  
  const navigateToAI = useCallback(() => {
    router.push('/ai');
  }, [router]);
  
  const renderMarketHeatmap = useCallback(() => {
    if (!cryptoData.length) return null;
    
    return (
      <View style={styles.heatmapContainer}>
        <Text style={styles.sectionTitle}>{locale.home.marketHeatmap}</Text>
        <View style={styles.heatmapGrid}>

          {cryptoData.slice(0, 12).map(coin => (
            <HeatmapItem 
              key={coin.id} 
              coin={coin} 
              // Uncomment when ready to implement navigation
              // onPress={() => router.push(`/crypto/${coin.id}`)}
            />
          ))}
          
        </View>
      </View>
    );
  }, [cryptoData]);

  const renderTrendingCoins = useCallback(() => {
    if (!gainers.length || !losers.length) return null;
    
    return (
      <View style={styles.trendingContainer}>
        <View style={styles.trendingSection}>
          <Text style={styles.sectionTitle}>{locale.home.topGainers}</Text>
          {gainers.map(coin => (
            <CoinItem 
              key={coin.id} 
              coin={coin} 
              // Uncomment when ready to implement navigation
              // onPress={() => router.push(`/crypto/${coin.id}`)}
            />
          ))}
        </View>
        
        <View style={styles.trendingSection}>
          <Text style={styles.sectionTitle}>{locale.home.topLosers}</Text>
          {losers.map(coin => (
            <CoinItem 
              key={coin.id} 
              coin={coin}
              // Uncomment when ready to implement navigation
              // onPress={() => router.push(`/crypto/${coin.id}`)}
            />
          ))}
        </View>
      </View>
    );
  }, [gainers, losers]);

  const renderAIRecommendations = useCallback(() => {
    return (
      <View style={styles.aiRecommendationsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{locale.home.aiRecommendations}</Text>
          <Ionicons name="flash" size={20} color="#FFD700" />
        </View>
        
        {aiRecommendations.map(recommendation => (
          <RecommendationCard 
            key={recommendation.coinId} 
            recommendation={recommendation}
            // Uncomment when ready to implement navigation
            // onPress={() => router.push(`/crypto/${recommendation.coinId}`)}
          />
        ))}
        
        <TouchableOpacity 
          style={styles.viewMoreButton}
          onPress={navigateToAI}
        >
          <Text style={styles.viewMoreText}>{locale.home.viewMore}</Text>
          <Ionicons name="arrow-forward" size={16} color="#3498db" />
        </TouchableOpacity>
      </View>
    );
  }, [navigateToAI]);

  // Main render logic
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>{locale.common.loading}</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{locale.home.title}</Text>
          <Text style={styles.headerDate}>{formattedDate}</Text>
        </View>
        <View style={styles.marketIndicator}>
          <Text style={[
            styles.marketTrendText, 
            { 
              color: marketTrend === 'up' 
                ? '#4CAF50' 
                : marketTrend === 'down' 
                  ? '#FF6B6B' 
                  : '#FFD700' 
            }
          ]}>
            {marketTrend === 'up' 
              ? locale.home.marketUp 
              : marketTrend === 'down' 
                ? locale.home.marketDown 
                : locale.home.marketStable
            }
          </Text>
          <Ionicons 
            name={
              marketTrend === 'up' 
                ? 'trending-up' 
                : marketTrend === 'down' 
                  ? 'trending-down' 
                  : 'remove'
            } 
            size={18} 
            color={
              marketTrend === 'up' 
                ? '#4CAF50' 
                : marketTrend === 'down' 
                  ? '#FF6B6B' 
                  : '#FFD700'
            } 
          />
        </View>
        <View style={styles.marketIndicator}>
          <TouchableOpacity onPress={navigateToSettings}>
            <Ionicons name='cog-outline' size={24} color='white'/>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing || isRequestPending.current} 
            colors={['#3498db']}
            tintColor="#ffffff"
            onRefresh={onRefresh}
          />
        }
      >
        {renderMarketHeatmap()}
        {renderTrendingCoins()}
        {renderAIRecommendations()}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by CryptoAI • {locale.common.refresh} {new Date(lastRequestTime.current).toLocaleTimeString()}
          </Text>
        </View>
      </ScrollView>
      <StatusBar style='light' />
    </SafeAreaView>
  );
};

// Styles are unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerDate: {
    fontSize: 12,
    color: '#aaaaaa',
  },
  marketIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  marketTrendText: {
    fontSize: 12,
    marginRight: 5,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  heatmapContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  heatmapItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
  },
  heatmapSymbol: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  heatmapChange: {
    color: '#ffffff',
    fontSize: 12,
  },
  trendingContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  trendingSection: {
    marginBottom: 20,
  },
  coinItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 10,
    width: 50,
  },
  coinName: {
    fontSize: 14,
    color: '#aaaaaa',
  },
  coinPriceInfo: {
    alignItems: 'flex-end',
  },
  coinPrice: {
    fontSize: 14,
    color: '#ffffff',
  },
  coinChange: {
    fontSize: 12,
  },
  aiRecommendationsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  recommendationCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationCoin: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  actionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  recommendationReason: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 10,
  },
  confidenceBar: {
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  confidenceFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  confidenceText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    color: '#ffffff',
  },
  viewMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  viewMoreText: {
    color: '#3498db',
    marginRight: 5,
  },
  footer: {
    padding: 36,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
  },
});

export default React.memo(HomeScreen);
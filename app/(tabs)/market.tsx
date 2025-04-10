import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useLanguage } from '../mobx/LanguageStore/LanguageStore';
import Loading from '../screens/Loading';

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

function MarketScreen() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const {locale} = useLanguage();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cryptoData, setCryptoData] = useState<CryptoCurrency[]>([]);
  const [allCryptoData, setAllCryptoData] = useState<CryptoCurrency[]>([]);
  const [sortBy, setSortBy] = useState<'market_cap' | 'price_change_percentage_24h'>('market_cap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<CryptoCurrency[]>([]);

  const fetchCryptoData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setPage(1);
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 200,
            page: isInitialLoad ? 1 : page,
            sparkline: false,
            price_change_percentage: '24h'
          }
        }
      );

      if (isInitialLoad) {
        setCryptoData(response.data);
        setAllCryptoData(response.data);
      } else {
        const newData = [...allCryptoData, ...response.data];
        setAllCryptoData(newData);
        
        if (searchQuery.trim() === '') {
          setCryptoData(newData);
        } else {
          const query = searchQuery.toLowerCase();
          const filteredData = newData.filter(
            item => item.name.toLowerCase().includes(query) || 
                    item.symbol.toLowerCase().includes(query)
          );
          setCryptoData(filteredData);
        }
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [page, searchQuery, allCryptoData]);

  useEffect(() => {
    fetchCryptoData(true);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setCryptoData(allCryptoData);
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filteredSuggestions = allCryptoData.filter(
      item => item.name.toLowerCase().includes(query) || 
              item.symbol.toLowerCase().includes(query)
    ).slice(0, 5);
    
    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
    
    const filteredData = allCryptoData.filter(
      item => item.name.toLowerCase().includes(query) || 
              item.symbol.toLowerCase().includes(query)
    );
    
    setCryptoData(filteredData);
  }, [searchQuery, allCryptoData]);

  useEffect(() => {
    if (page > 1) {
      fetchCryptoData(false);
    }
  }, [page, fetchCryptoData]);

  const loadMoreData = useCallback(() => {
    if (!loadingMore && !searchQuery.trim()) { 
      setPage(prevPage => prevPage + 1);
    }
  }, [loadingMore, searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSearchQuery('');
    fetchCryptoData(true);
  }, [fetchCryptoData]);

  const sortData = useCallback(() => {
    const sortedData = [...cryptoData];
    
    sortedData.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortBy] - b[sortBy];
      } else {
        return b[sortBy] - a[sortBy];
      }
    });
    
    return sortedData;
  }, [cryptoData, sortBy, sortOrder]);

  const toggleSort = useCallback((field: 'market_cap' | 'price_change_percentage_24h') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy, sortOrder]);

  const selectSuggestion = useCallback((item: CryptoCurrency) => {
    setSearchQuery(item.name);
    setCryptoData([item]);
    setShowSuggestions(false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const renderSuggestion = useCallback(({ item }: { item: CryptoCurrency }) => (
    <TouchableOpacity 
      style={styles.suggestionItem}
      onPress={() => selectSuggestion(item)}
    >
      <Text style={styles.suggestionSymbol}>{item.symbol.toUpperCase()}</Text>
      <Text style={styles.suggestionName}>{item.name}</Text>
    </TouchableOpacity>
  ), [selectSuggestion]);

  const renderCoinItem = useCallback(({ item, index }: { item: CryptoCurrency, index: number }) => (
    <TouchableOpacity 
      style={styles.coinItem}
      onPress={() => router.push(`/crypto/${item.id}`)}
    >
      <View style={styles.coinInfo}>
        <Text style={styles.coinRank}>{index + 1}</Text>
        <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
        <Text style={styles.coinName}>{item.name}</Text>
      </View>
      <View style={styles.coinPriceInfo}>
        <Text style={styles.coinPrice}>${item.current_price ? item.current_price.toLocaleString() : '0.00'}</Text>
        <Text style={[
          styles.coinChange, 
          { color: (item.price_change_percentage_24h || 0) >= 0 ? '#4CAF50' : '#FF6B6B' }
        ]}>
          {(item.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
          {(item.price_change_percentage_24h !== null && item.price_change_percentage_24h !== undefined) 
            ? item.price_change_percentage_24h.toFixed(2) 
            : '0.00'}%
        </Text>
      </View>
    </TouchableOpacity>
  ), [router]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#3498db" />
        <Text style={styles.loadingMoreText}>{locale.market.loadingMore || 'Loading more...'}</Text>
      </View>
    );
  }, [loadingMore, locale.market.loadingMore]);

  const refreshControl = useMemo(() => (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  ), [refreshing, onRefresh]);

  const listEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {locale.market.noResults || "No cryptocurrencies found"}
      </Text>
    </View>
  ), [locale.market.noResults]);

  const sortedData = useMemo(() => sortData(), [sortData]);

  if (loading && !refreshing) {
    return <Loading locale={locale} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {locale.market.title}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#aaaaaa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={locale.market.searchPlaceholder || "Search cryptocurrency..."}
            placeholderTextColor="#777777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#aaaaaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={item => item.id}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      <View style={styles.sortHeader}>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => toggleSort('market_cap')}
        >
          <Text style={[
            styles.sortButtonText, 
            sortBy === 'market_cap' ? styles.sortButtonActive : {}
          ]}>
            {locale.market.marketCap}
            {sortBy === 'market_cap' && (
              <Ionicons 
                name={sortOrder === 'asc' ? 'caret-up' : 'caret-down'} 
                size={12} 
              />
            )}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => toggleSort('price_change_percentage_24h')}
        >
          <Text style={[
            styles.sortButtonText, 
            sortBy === 'price_change_percentage_24h' ? styles.sortButtonActive : {}
          ]}>
            {locale.market.change24h}
            {sortBy === 'price_change_percentage_24h' && (
              <Ionicons 
                name={sortOrder === 'asc' ? 'caret-up' : 'caret-down'} 
                size={12} 
              />
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedData}
        renderItem={renderCoinItem}
        keyExtractor={item => item.id}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshControl={refreshControl}
        ListEmptyComponent={listEmptyComponent}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={21}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}

const MarketScreenObserver = observer(MarketScreen);

export default MarketScreenObserver;

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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    padding: 0,
    height: 40,
  },
  clearButton: {
    padding: 5,
  },
  suggestionsContainer: {
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  suggestionSymbol: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    width: 60,
    marginRight: 10,
  },
  suggestionName: {
    fontSize: 14,
    color: '#aaaaaa',
  },
  sortHeader: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#aaaaaa',
    fontSize: 14,
  },
  sortButtonActive: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  coinItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinRank: {
    width: 30,
    fontSize: 14,
    color: '#aaaaaa',
  },
  coinSymbol: {
    width: 60,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 10,
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
    fontWeight: 'bold',
  },
  coinChange: {
    fontSize: 12,
    marginTop: 4,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingMoreText: {
    color: '#aaaaaa',
    marginLeft: 8,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#aaaaaa',
    fontSize: 16,
  }
});
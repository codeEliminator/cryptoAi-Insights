import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useLanguage } from '../mobx/LanguageStore/LanguageStore';
import Loading from '../screens/Loading';
import { debounce } from '../helpers/debounce';
import CoinItem from '../components/reusable-market-components/CoinItem';
import SuggestionItem from '../components/reusable-market-components/SuggestionItem';
import EmptyList from '../components/reusable-market-components/EmptyList';
import { sortedData } from '../components/reusable-market-components/helpers/sortedData';
import { CryptoCurrency } from '../types/types';
import { getFilteredData } from '../components/reusable-market-components/helpers/getFilteredData';
import { getSuggestions } from '../components/reusable-market-components/helpers/getSuggestions';
import getUniqueId from '../helpers/getUniqueId';

export type SortByType = 'market_cap' | 'price_change_percentage_24h';
export type SortOrderType = 'asc' | 'desc';

function MarketScreen() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { locale } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allCryptoData, setAllCryptoData] = useState<CryptoCurrency[]>([]);
  const [sortBy, setSortBy] = useState<SortByType>('market_cap');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearch = useMemo(() => debounce((text: string) => setSearchQuery(text), 300), []);

  const filteredData = useMemo(
    () => getFilteredData(searchQuery, allCryptoData),
    [searchQuery, allCryptoData]
  );

  const suggestions = useMemo(
    () => getSuggestions(searchQuery, allCryptoData),
    [allCryptoData, searchQuery]
  );

  const sortData = useMemo(
    () => sortedData(filteredData, sortBy, sortOrder),
    [filteredData, sortBy, sortOrder]
  );

  useEffect(() => {
    setShowSuggestions(suggestions.length > 0 && searchQuery.trim() !== '');
  }, [suggestions, searchQuery]);

  const fetchCryptoData = useCallback(
    async (isInitialLoad = false) => {
      if (isInitialLoad) {
        setPage(1);
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 50,
            page: isInitialLoad ? 1 : page,
            sparkline: false,
            price_change_percentage: '24h',
          },
        });

        if (isInitialLoad) {
          setAllCryptoData(response.data);
        } else {
          setAllCryptoData(prev => [...prev, ...response.data]);
        }
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [page]
  );

  useEffect(() => {
    fetchCryptoData(true);
  }, []);

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
    setInputValue('');
    setSearchQuery('');
    fetchCryptoData(true);
  }, [fetchCryptoData]);

  const toggleSort = useCallback(
    (field: SortByType) => {
      if (sortBy === field) {
        setSortOrder(current => (current === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setSortOrder('desc');
      }
    },
    [sortBy]
  );

  const selectSuggestion = useCallback((item: CryptoCurrency) => {
    const newValue = item.name;
    setInputValue(newValue);
    setSearchQuery(newValue);
    setShowSuggestions(false);
  }, []);

  const clearSearch = useCallback(() => {
    setInputValue('');
    setSearchQuery('');
  }, []);

  const handleSearchChange = useCallback(
    (text: string) => {
      setInputValue(text);
      debouncedSearch(text);
    },
    [debouncedSearch]
  );

  const handleCoinPress = useCallback(
    (coinId: string) => {
      router.push(`/screens/crypto/${coinId}`);
    },
    [router]
  );

  const renderCoinItem = useCallback(
    ({ item, index }: { item: CryptoCurrency; index: number }) => (
      <CoinItem item={item} index={index} onPress={handleCoinPress} />
    ),
    [handleCoinPress]
  );

  const renderSuggestion = useCallback(
    ({ item }: { item: CryptoCurrency }) => (
      <SuggestionItem item={item} onSelect={selectSuggestion} />
    ),
    [selectSuggestion]
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#3498db" />
        <Text style={styles.loadingMoreText}>{locale.market.loadingMore || 'Loading more...'}</Text>
      </View>
    );
  }, [loadingMore, locale.market.loadingMore]);

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 70,
      offset: 70 * index,
      index,
    }),
    []
  );

  if (loading && !refreshing) {
    return <Loading locale={locale} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{locale.market.title}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#aaaaaa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={locale.market.searchPlaceholder || 'Search cryptocurrency...'}
            placeholderTextColor="#777777"
            value={inputValue}
            onChangeText={handleSearchChange}
          />
          {inputValue.length > 0 && (
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
            keyExtractor={getUniqueId}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
          />
        </View>
      )}

      <View style={styles.sortHeader}>
        <TouchableOpacity style={styles.sortButton} onPress={() => toggleSort('market_cap')}>
          <Text
            style={[styles.sortButtonText, sortBy === 'market_cap' ? styles.sortButtonActive : {}]}
          >
            {locale.market.marketCap}
            {sortBy === 'market_cap' && (
              <Ionicons name={sortOrder === 'asc' ? 'caret-up' : 'caret-down'} size={12} />
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => toggleSort('price_change_percentage_24h')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortBy === 'price_change_percentage_24h' ? styles.sortButtonActive : {},
            ]}
          >
            {locale.market.change24h}
            {sortBy === 'price_change_percentage_24h' && (
              <Ionicons name={sortOrder === 'asc' ? 'caret-up' : 'caret-down'} size={12} />
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortData}
        renderItem={renderCoinItem}
        keyExtractor={getUniqueId}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<EmptyList locale={locale} />}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
        nestedScrollEnabled={false}
      />
    </SafeAreaView>
  );
}

export default observer(MarketScreen);

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
});

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useLanguageStore, useCryptoStore } from '../mobx/MainStore';
import Loading from '../screens/Loading';
import { debounce } from '../helpers/debounce';
import CoinItem from '../components/reusable-market-components/CoinItem';
import EmptyList from '../components/reusable-market-components/EmptyList';
import { sortedData } from '../components/reusable-market-components/helpers/sortedData';
import { CryptoCurrency } from '../types/types';
import { getSuggestions } from '../components/reusable-market-components/helpers/getSuggestions';
import ShowSuggestionsComponent from '../components/reusable-market-components/ShowSuggestionsComponent';
import SearchComponent from '../components/reusable-market-components/SearchComponent';

export type SortByType = 'market_cap' | 'price_change_percentage_24h';
export type SortOrderType = 'asc' | 'desc';

function MarketScreen() {
  const router = useRouter();
  const { locale } = useLanguageStore();
  const { cryptoData, loading, refreshing, loadMore, refresh } = useCryptoStore();
  const [sortBy, setSortBy] = useState<SortByType>('market_cap');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearch = useMemo(() => debounce((text: string) => setSearchQuery(text), 300), []);

  const suggestions = getSuggestions(searchQuery, cryptoData);

  const sortData = useMemo(
    () => sortedData(cryptoData, sortBy, sortOrder),
    [cryptoData, sortBy, sortOrder]
  );

  useEffect(() => {
    setShowSuggestions(suggestions.length > 0 && searchQuery.trim() !== '');
  }, [suggestions, searchQuery]);

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

  const renderFooter = useCallback(() => {
    if (!loading) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#3498db" />
        <Text style={styles.loadingMoreText}>{locale.market.loadingMore || 'Loading more...'}</Text>
      </View>
    );
  }, [loading]);

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

      <SearchComponent
        locale={locale}
        inputValue={inputValue}
        handleSearchChange={handleSearchChange}
        clearSearch={clearSearch}
      />

      {showSuggestions && <ShowSuggestionsComponent suggestions={suggestions} />}

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
        keyExtractor={item => item.uuid}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
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

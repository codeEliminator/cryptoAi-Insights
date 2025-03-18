import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

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

export default function MarketScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cryptoData, setCryptoData] = useState<CryptoCurrency[]>([]);
  const [sortBy, setSortBy] = useState<'market_cap' | 'price_change_percentage_24h'>('market_cap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h'
          }
        }
      );
      setCryptoData(response.data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      // В случае ошибки можно добавить фиктивные данные
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCryptoData();
  };

  const sortData = () => {
    // Создаем копию массива, чтобы не мутировать state напрямую
    const sortedData = [...cryptoData];
    
    // Сортируем в зависимости от выбранного поля и порядка
    sortedData.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortBy] - b[sortBy];
      } else {
        return b[sortBy] - a[sortBy];
      }
    });
    
    return sortedData;
  };

  const toggleSort = (field: 'market_cap' | 'price_change_percentage_24h') => {
    if (sortBy === field) {
      // Если уже сортируем по этому полю, меняем порядок
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Иначе меняем поле сортировки и сбрасываем порядок
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const renderCoinItem = ({ item }: { item: CryptoCurrency }) => {
    return (
      <TouchableOpacity 
        style={styles.coinItem}
        // onPress={() => router.push(`/crypto/${item.id}`)}
      >
        <View style={styles.coinInfo}>
          <Text style={styles.coinRank}>{cryptoData.indexOf(item) + 1}</Text>
          <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
          <Text style={styles.coinName}>{item.name}</Text>
        </View>
        <View style={styles.coinPriceInfo}>
          <Text style={styles.coinPrice}>${item.current_price.toLocaleString()}</Text>
          <Text style={[
            styles.coinChange, 
            { color: item.price_change_percentage_24h >= 0 ? '#4CAF50' : '#FF6B6B' }
          ]}>
            {item.price_change_percentage_24h >= 0 ? '+' : ''}
            {item.price_change_percentage_24h.toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Загрузка данных...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Рынок криптовалют</Text>
      </View>

      <View style={styles.sortHeader}>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => toggleSort('market_cap')}
        >
          <Text style={[
            styles.sortButtonText, 
            sortBy === 'market_cap' ? styles.sortButtonActive : {}
          ]}>
            Капитализация
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
            Изменение (24ч)
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
        data={sortData()}
        renderItem={renderCoinItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

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
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CryptoCurrency } from '../types/types';
import { Ionicons } from '@expo/vector-icons';

const CoinItem = React.memo(({ coin, onPress }: { coin: CryptoCurrency; onPress?: () => void,  }) => {
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

const styles = StyleSheet.create({
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
});

export default CoinItem;
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CryptoCurrency } from '../types/types';

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
}, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.coin) === JSON.stringify(nextProps.coin);
});

const styles = StyleSheet.create({
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
});

export default HeatmapItem;

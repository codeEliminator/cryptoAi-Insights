import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CryptoCurrency } from '../types/types';
import HeatmapItem from './HeatmapItem';

const Heatmap = memo(({ cryptoData, locale }: { cryptoData: CryptoCurrency[], locale: any }) => {
  if (!cryptoData.length) return null;
  
  return (
    <View style={styles.heatmapContainer}>
      <Text style={styles.sectionTitle}>{locale.home.marketHeatmap}</Text>
      <View style={styles.heatmapGrid}>
        {cryptoData.slice(0, 12).map(coin => (
          <HeatmapItem 
            key={coin.id} 
            coin={coin} 
          />
        ))}
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.locale === nextProps.locale &&
    JSON.stringify(prevProps.cryptoData) === JSON.stringify(nextProps.cryptoData)
  );
});

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
});

export default Heatmap;

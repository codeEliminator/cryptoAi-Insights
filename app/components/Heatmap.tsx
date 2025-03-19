import React, { memo } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { CryptoCurrency } from '../types/types';
import HeatmapItem from './HeatmapItem';
import { router } from 'expo-router';

const { width } = Dimensions.get('window'); 

const Heatmap = memo(({ cryptoData, locale }: { cryptoData: CryptoCurrency[], locale: any }) => {
  if (!cryptoData.length) return null;
  const paginatedData = [];
  for (let i = 0; i < cryptoData.length; i += 15) {
    paginatedData.push(cryptoData.slice(i, i + 15));
  }

  return (
    <View style={styles.heatmapContainer}>
      <Text style={styles.sectionTitle}>{locale.home.marketHeatmap}</Text>
      <FlatList
        data={paginatedData}
        horizontal
        pagingEnabled 
        showsHorizontalScrollIndicator={false} 
        keyExtractor={(_, index) => `page-${index}`}
        renderItem={({ item }) => (
          <View style={[styles.heatmapGrid, { width: width - 60 }]}>
            {item.map(coin => (
              <HeatmapItem key={coin.id} coin={coin} onPress={() => { router.push(`/crypto/${coin.id}`); }}/>
            ))}
          </View>
        )}
      />
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginRight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
});

export default Heatmap;

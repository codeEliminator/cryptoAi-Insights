import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CryptoCurrency } from '../types/types';
import CoinItem from './CoinItem';
import { useTrendingCoins } from "../hooks/useTrendingCoins";
import { LocalizationData } from '../types/LocalizationData';

const TrendingCoins = memo(({ cryptoData, locale, router }: { cryptoData: CryptoCurrency[], locale: LocalizationData, router: any }) => {
  const { gainers, losers } = useTrendingCoins(cryptoData);

  if (!gainers.length || !losers.length) return null;

  return (
    <View style={styles.trendingContainer}>
      <View style={styles.trendingSection}>
        <Text style={styles.sectionTitle}>{locale.home.topGainers}</Text>
        {gainers.map(coin => (
          <CoinItem key={coin.id} coin={coin} onPress={() => { router.push(`/crypto/${coin.id}` )}}/>
        ))}
      </View>

      <View style={styles.trendingSection}>
        <Text style={styles.sectionTitle}>{locale.home.topLosers}</Text>
        {losers.map(coin => (
          <CoinItem key={coin.id} coin={coin} onPress={() => { router.push(`/crypto/${coin.id}` )}}/>
        ))}
      </View>
    </View>
  );
}, (prevProps, nextProps) => 
  prevProps.locale === nextProps.locale &&
  prevProps.cryptoData.length === nextProps.cryptoData.length &&
  prevProps.cryptoData.every((coin, i) => coin.id === nextProps.cryptoData[i].id && coin.price_change_percentage_24h === nextProps.cryptoData[i].price_change_percentage_24h)
);

const styles = StyleSheet.create({
  trendingContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  trendingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
});

export default TrendingCoins;

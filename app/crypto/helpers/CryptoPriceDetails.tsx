import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CoinDetail } from '../../types/types';
import { LocalizationData } from '@/app/types/LocalizationData';
const CryptoPriceDisplay = ({ coin, locale }: {coin: CoinDetail | null, locale: LocalizationData} ) => {
  
  const priceRange = coin?.market_data?.high_24h?.usd! - coin?.market_data?.low_24h?.usd! || 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.priceRow}>
        <Text style={styles.priceText}>
          {new Intl.NumberFormat('ru', { maximumFractionDigits: 2 }).format(coin?.market_data.current_price.usd!)}
        </Text>
        <Text style={styles.currencyText}> USD </Text>
        <Text style={styles.rangeText}>
          {new Intl.NumberFormat('ru', { maximumFractionDigits: 2 }).format(priceRange)}
        </Text>
        <Text style={styles.percentageText}>
          ({coin?.market_data.price_change_percentage_24h.toFixed(2)}%)
        </Text>
      </View>
      <View style={styles.marketStatusRow}>
        <View style={styles.statusIndicator}></View>
        <Text style={styles.statusText}>{locale.crypto.marketOpen}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'flex-start'
  },
  priceRow: {
    marginTop: 20, 
    display: 'flex', 
    flexDirection: 'row',  
    alignItems: 'baseline',
  },
  priceText: {
    fontSize: 26, 
    fontWeight: 'bold', 
    color: 'white'
  },
  currencyText: {
    fontSize: 12, 
    color: 'white'
  },
  rangeText: {
    fontSize: 16, 
    color: 'white', 
    marginRight: 5
  },
  percentageText: {
    fontSize: 16, 
    color: 'white', 
    marginRight: 10
  },
  marketStatusRow: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  statusIndicator: {
    backgroundColor: '#dbdbdb', 
    borderRadius: 3, 
    height: 6, 
    marginRight: 4, 
    width: 6
  },
  statusText: {
    color: '#dbdbdb'
  }
});

export default CryptoPriceDisplay;
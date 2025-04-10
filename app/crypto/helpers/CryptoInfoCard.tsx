import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CoinDetail } from '../../types/types';
import { LocalizationData } from '@/app/types/LocalizationData';

const CryptoInfoCard = ({ coin, locale, abbreviateNumber }: {coin: CoinDetail | null, locale: LocalizationData, abbreviateNumber: (number: number) => string }) => {
  const change = coin?.market_data?.price_change_percentage_24h || 0;
  const backgroundColor = change > 2 
    ? "rgb(5, 102, 54)" 
    : change > 0 
      ? "rgb(66, 189, 127)" 
      : "rgb(247, 124, 128)";
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.row}>
        <Text style={styles.text}>{locale.crypto.marketCapRating}</Text>
        <Text style={styles.text}>#{coin?.market_cap_rank}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>{locale.crypto.marketCap}</Text>  
        <Text style={styles.text}>{abbreviateNumber(Number(coin?.market_data.market_cap.usd))} $</Text>  
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>{locale.crypto.totalSupply}</Text>
        <Text style={styles.text}>{abbreviateNumber(Number(coin?.market_data.total_supply))} $</Text>
      </View>
      {
        coin?.market_data.max_supply && (     
          <View style={styles.row}>
            <Text style={styles.text}>{locale.crypto.maxSupply}</Text>
            <Text style={styles.text}>{abbreviateNumber(Number(coin?.market_data.max_supply))} $</Text>
          </View>
        )  
      }
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    height: 150,
    display: "flex",
    justifyContent: "space-between",
  },
  row: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
  }
});

export default CryptoInfoCard;
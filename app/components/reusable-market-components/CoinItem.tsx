import { memo, useCallback } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { CryptoCurrency } from '@/app/types/types';

const CoinItem = memo(
  ({
    item,
    index,
    onPress,
  }: {
    item: CryptoCurrency;
    index: number;
    onPress: (id: string) => void;
  }) => {
    const handlePress = useCallback(() => {
      onPress(item.id);
    }, [item.id, onPress]);

    return (
      <TouchableOpacity style={styles.coinItem} onPress={handlePress}>
        <View style={styles.coinInfo}>
          <Text style={styles.coinRank}>{index + 1}</Text>
          <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
          <Text style={styles.coinName}>{item.name}</Text>
        </View>
        <View style={styles.coinPriceInfo}>
          <Text style={styles.coinPrice}>
            ${item.current_price ? item.current_price.toLocaleString() : '0.00'}
          </Text>
          <Text
            style={[
              styles.coinChange,
              { color: (item.price_change_percentage_24h || 0) >= 0 ? '#4CAF50' : '#FF6B6B' },
            ]}
          >
            {(item.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
            {item.price_change_percentage_24h !== null &&
            item.price_change_percentage_24h !== undefined
              ? item.price_change_percentage_24h.toFixed(2)
              : '0.00'}
            %
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item.id === nextProps.item.id && prevProps.index === nextProps.index
);
export default CoinItem;

const styles = StyleSheet.create({
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

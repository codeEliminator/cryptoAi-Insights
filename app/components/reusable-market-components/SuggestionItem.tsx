import { memo, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CryptoCurrency } from '@/app/types/types';

const SuggestionItem = memo(
  ({ item, onSelect }: { item: CryptoCurrency; onSelect: (coinId: string) => void }) => {
    const handlePress = useCallback(() => {
      onSelect(item.id);
    }, [item, onSelect]);

    return (
      <TouchableOpacity style={styles.suggestionItem} onPress={handlePress}>
        <Text style={styles.suggestionSymbol}>{item.symbol.toUpperCase()}</Text>
        <Text style={styles.suggestionName}>{item.name}</Text>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
);
export default SuggestionItem;

const styles = StyleSheet.create({
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  suggestionSymbol: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    width: 60,
    marginRight: 10,
  },
  suggestionName: {
    fontSize: 14,
    color: '#aaaaaa',
  },
});

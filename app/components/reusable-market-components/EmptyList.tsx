import { View, Text, StyleSheet } from 'react-native';
import { LocalizationData } from '@/app/types/LocalizationData';

const EmptyList = ({ locale }: { locale: LocalizationData }) => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{locale.market.noResults}</Text>
    </View>
  );
};

export default EmptyList;

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#aaaaaa',
    fontSize: 16,
  },
});

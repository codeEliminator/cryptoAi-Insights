import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import formatNumber from "@/app/helpers/formatNumber";

export default function TokenCard({ token, index }: { token: any, index: number }) {
  return (
    <View key={index} style={styles.tokenItem}>
      <Text style={styles.tokenName}>{token.name} ({token.symbol})</Text>
      <Text style={styles.tokenBalance}>{formatNumber(token.balance)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tokenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '500',
  },
  tokenBalance: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
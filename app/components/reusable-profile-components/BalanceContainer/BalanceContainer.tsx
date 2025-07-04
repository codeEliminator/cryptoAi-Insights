import { View, Text, StyleSheet } from 'react-native';
import formatNumber from '@/app/helpers/formatNumber';
import { LocalizationData } from '@/app/types/LocalizationData';
import { WalletStore } from '@/app/mobx/WalletStore/types';

interface BalanceContainerProps {
  locale: LocalizationData;
  walletStore: WalletStore;
}

export default function BalanceContainer({ locale, walletStore }: BalanceContainerProps) {
  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.label}>{locale.profile.nativeBalance}</Text>
      <Text style={styles.balance}>
        {formatNumber(walletStore.balance)}
        {walletStore.getNetworkParams()?.currency}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  balance: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

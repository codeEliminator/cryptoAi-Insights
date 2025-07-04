import { LocalizationData } from '@/app/types/LocalizationData';
import { View, Text, StyleSheet } from 'react-native';
import { WalletStore } from '@/app/mobx/WalletStore/types';
interface AddressContainerProps {
  locale: LocalizationData;
  walletInfo: Record<string, any> | null | undefined;
  walletStore: WalletStore;
}

export default function AddressContainer({
  locale,
  walletInfo,
  walletStore,
}: AddressContainerProps) {
  return (
    <View style={styles.addressContainer}>
      <Text style={styles.label}>{locale.profile.walletAddress}</Text>
      <Text style={styles.address}>{walletStore.address}</Text>

      {walletInfo && (
        <View style={styles.walletInfoContainer}>
          <Text style={styles.walletName}>{walletInfo?.name || 'Wallet'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addressContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    fontWeight: '500',
  },
  walletInfoContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  walletName: {
    fontSize: 14,
    color: '#666',
  },
});

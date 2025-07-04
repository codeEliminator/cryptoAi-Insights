import { WalletStore } from '@/app/mobx/WalletStore/types';
import { LocalizationData } from '@/app/types/LocalizationData';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface NetWorkContainerProps {
  locale: LocalizationData;
  walletStore: WalletStore;
  handleSwitchNetwork: () => void;
}

export default function NetworkContainer({
  locale,
  walletStore,
  handleSwitchNetwork,
}: NetWorkContainerProps) {
  return (
    <View style={styles.networkContainer}>
      <Text style={styles.label}>{locale.profile.network}</Text>
      <Text style={styles.networkName}>
        {walletStore.chainId === 1
          ? 'Ethereum'
          : walletStore.chainId === 137
            ? 'Polygon'
            : `Chain ID: ${walletStore.chainId}`}
      </Text>

      <TouchableOpacity style={styles.switchNetworkButton} onPress={() => handleSwitchNetwork()}>
        <Text style={styles.switchNetworkText}>{locale.profile.switchToEthereum}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  networkContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  networkName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  switchNetworkButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  switchNetworkText: {
    color: 'white',
    fontWeight: '500',
  },
});

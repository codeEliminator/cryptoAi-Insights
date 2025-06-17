import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { WalletStore } from "@/app/mobx/WalletStore/types";

export default function ForceLoginScreen({ walletStore }: { walletStore: WalletStore }) {
  return (
    <TouchableOpacity
      onPress={() => {
        walletStore.forceLogin();
      }}
      style={{
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    }}
  >
    <Text style={{ color: 'white', fontWeight: 'bold' }}>Fake Login (Dev)</Text>
  </TouchableOpacity>
  );
}
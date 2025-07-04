import '@walletconnect/react-native-compat';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import AddressContainer from '../components/reusable-profile-components/AddressContainer/AddressContainer';
import NetworkContainer from '../components/reusable-profile-components/NetworkContainer/NetworkContainer';
import BalanceContainer from '../components/reusable-profile-components/BalanceContainer/BalanceContainer';
import LoginScreen from '../components/reusable-profile-components/LoginScreen';
import ForceLoginScreen from '../components/reusable-profile-components/ForceLoginScreen';
import TokenCard from '../components/reusable-profile-components/TokenCard';
import {
  mainnet,
  polygon,
  bsc,
  avalanche,
  arbitrum,
  optimism,
  fantom,
  base,
} from '../utils/chains/chains';
import {
  useAppKit,
  useAppKitAccount,
  useWalletInfo,
  useAppKitProvider,
  useAppKitState,
  createAppKit,
  defaultConfig,
  AppKit,
  useDisconnect,
} from '@reown/appkit-ethers-react-native';
import { useLanguageStore, useWalletStore } from '../mobx/MainStore';
import { PROJECTID, metadata } from '../configs/AppConfig';

const config = defaultConfig({ metadata });

const chains = [mainnet, polygon, bsc, avalanche, arbitrum, optimism, fantom, base];

createAppKit({
  projectId: PROJECTID,
  chains,
  config,
  enableAnalytics: true,
});

const Profile = observer(() => {
  const { language, locale } = useLanguageStore();
  const walletStore = useWalletStore();
  const { open, close } = useAppKit();
  const { disconnect } = useDisconnect();
  const { address, chainId, isConnected } = useAppKitAccount();
  const { walletInfo } = useWalletInfo();
  const { walletProvider } = useAppKitProvider();
  const { selectedNetworkId } = useAppKitState();

  useEffect(() => {
    walletStore.setWalletState(
      address,
      chainId as number,
      isConnected,
      walletInfo as Record<string, any>
    );
  }, [address, chainId, isConnected, walletInfo]);

  useEffect(() => {
    if (walletProvider) {
      walletStore.setProvider(walletProvider);
    }
  }, [walletProvider]);

  const handleConnect = (): void => {
    open({ view: 'Connect' });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleSwitchNetwork = (): void => {
    open({ view: 'Networks' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content"></StatusBar>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AppKit></AppKit>
        {!walletStore.isConnected ? (
          <ForceLoginScreen walletStore={walletStore} />
        ) : (
          <View style={styles.walletContainer}>
            <AddressContainer locale={locale} walletInfo={walletInfo} walletStore={walletStore} />

            <NetworkContainer
              locale={locale}
              walletStore={walletStore}
              handleSwitchNetwork={handleSwitchNetwork}
            />

            {walletStore.isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
              <>
                <BalanceContainer locale={locale} walletStore={walletStore} />

                <View style={styles.tokensContainer}>
                  <Text style={styles.label}>{locale.profile.nativeBalance}</Text>

                  {walletStore.tokens.length === 0 ? (
                    <Text style={styles.noTokens}>{locale.profile.noTokensFound}</Text>
                  ) : (
                    walletStore.tokens.map((token, index) => (
                      <TokenCard key={token.uuid} token={token} index={index} />
                    ))
                  )}
                </View>
              </>
            )}

            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
              <Text style={styles.disconnectText}>{locale.profile.disconnectWallet}</Text>
            </TouchableOpacity>
          </View>
        )}

        {walletStore.error && <Text style={styles.errorText}>{walletStore.error}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
});
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flex: 0.9,
    padding: 16,
  },
  blockChainGif: {
    width: '100%',
    objectFit: 'contain',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaaaaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  walletContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tokensContainer: {
    marginBottom: 16,
  },

  noTokens: {
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 12,
  },
  disconnectButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disconnectText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 16,
    padding: 8,
    backgroundColor: '#fdeaea',
    borderRadius: 4,
  },
});

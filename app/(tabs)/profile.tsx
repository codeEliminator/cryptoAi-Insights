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
  StyleProp,
  ViewStyle,
  TextStyle,
  StatusBar,
  Image,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import LoginScreen from '../components/reusable-profile-components/LoginScreen';
import ForceLoginScreen from '../components/reusable-profile-components/ForceLoginScreen';
import TokenCard from '../components/reusable-profile-components/TokekCard';
import getUniqueId from '../helpers/getUniqueId';
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
import Constants from 'expo-constants';
import { useLanguageStore, useWalletStore } from '../mobx/MainStore';
import formatNumber from '../helpers/formatNumber';

interface ProfileProps {}
const projectId = Constants.expoConfig?.extra?.PROJECT_ID;

const metadata = {
  name: 'CryptoAi Insights',
  description: 'AI-powered crypto analytics and insights',
  url: 'https://reown.com/appkit',
  icons: ['https://imgur.com/a/qvUyFQZ'],
  redirect: {
    native: 'cryptoaiinsights://',
  },
};

const config = defaultConfig({ metadata });

const chains = [mainnet, polygon, bsc, avalanche, arbitrum, optimism, fantom, base];

createAppKit({
  projectId,
  chains,
  config,
  enableAnalytics: true,
});

const Profile: React.FC<ProfileProps> = observer(() => {
  const { language, locale } = useLanguageStore();
  const [currentTitle, setCurrentTitle] = useState(0);
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

  useEffect(() => {
    setTimeout(
      () =>
        setCurrentTitle(
          currentTitle + 1 < locale.profile.entryTitles.length ? currentTitle + 1 : 0
        ),
      2000
    );
  });

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
            <View style={styles.addressContainer}>
              <Text style={styles.label}>{locale.profile.walletAddress}</Text>
              <Text style={styles.address}>
                {address?.substring(0, 6)}...
                {address?.substring(address.length - 4)}
              </Text>

              {walletInfo && (
                <View style={styles.walletInfoContainer}>
                  <Text style={styles.walletName}>{walletInfo.name || 'Wallet'}</Text>
                </View>
              )}
            </View>

            <View style={styles.networkContainer}>
              <Text style={styles.label}>{locale.profile.network}</Text>
              <Text style={styles.networkName}>
                {chainId === 1 ? 'Ethereum' : chainId === 137 ? 'Polygon' : `Chain ID: ${chainId}`}
              </Text>

              <TouchableOpacity
                style={styles.switchNetworkButton}
                onPress={() => handleSwitchNetwork()}
              >
                <Text style={styles.switchNetworkText}>{locale.profile.switchToEthereum}</Text>
              </TouchableOpacity>
            </View>

            {walletStore.isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
              <>
                <View style={styles.balanceContainer}>
                  <Text style={styles.label}>{locale.profile.nativeBalance}</Text>
                  <Text style={styles.balance}>
                    {formatNumber(walletStore.balance)}
                    {walletStore.getNetworkParams()?.currency}
                  </Text>
                </View>

                <View style={styles.tokensContainer}>
                  <Text style={styles.label}>{locale.profile.nativeBalance}</Text>

                  {walletStore.tokens.length === 0 ? (
                    <Text style={styles.noTokens}>{locale.profile.noTokensFound}</Text>
                  ) : (
                    walletStore.tokens.map((token, index) => (
                      <TokenCard key={getUniqueId()} token={token} index={index} />
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

import { makeAutoObservable, runInAction } from 'mobx';
import { ethers } from 'ethers';
import { Moralis_API_KEY } from '@/app/configs/AppConfig';
import getUniqueId from '@/app/helpers/getUniqueId';
import { TokenInfo, NetworkParams, TokenResponse } from './types';


class WalletStore {
  address: `0x${string}` | null | undefined = null;
  isConnected: boolean = false;
  chainId: number | null = null;
  balance: string | null = null;
  tokens: TokenInfo[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  walletInfo: Record<string, any> | null = null;
  walletProvider: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  setWalletState(
    address: `0x${string}` | null | undefined,
    chainId: number | null,
    isConnected: boolean,
    walletInfo: Record<string, any> | null
  ): void {
    runInAction(() => {
      this.address = address;
      this.chainId = chainId;
      this.isConnected = isConnected;
      this.walletInfo = walletInfo;

      if (isConnected && address) {
        this.fetchBalance();
        this.fetchTokens();
      } else {
        this.balance = null;
        this.tokens = [];
      }
    });
  }

  setProvider(provider: any): void {
    this.walletProvider = provider;
  }
  forceLogin(): void {
    runInAction(() => {
      this.address = '0xFAKEADDRESS1234567890ABCDEFabcdef1234567890';
      this.chainId = 1;
      this.isConnected = true;
      this.walletInfo = {
        name: 'Fake Wallet',
        icon: null,
      };
      this.balance = '12.3456';
      this.tokens = [
        {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          name: 'Tether USD',
          symbol: 'USDT',
          balance: '123.45',
          decimals: 6,
          uuid: getUniqueId(),
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          name: 'USD Coin',
          symbol: 'USDC',
          balance: '67.89',
          decimals: 6,
          uuid: getUniqueId(),
        },
      ];
      this.error = null;
      this.isLoading = false;
    });
  }

  async fetchBalance(): Promise<void> {
    if (!this.address || !this.chainId || !this.walletProvider) return;

    this.isLoading = true;
    this.error = null;

    try {
      const ethersProvider = new ethers.BrowserProvider(this.walletProvider);
      const balance = await ethersProvider.getBalance(this.address);

      runInAction(() => {
        this.balance = ethers.formatEther(balance);
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error fetching balance:', error);
        this.error = 'Failed to fetch balance';
        this.isLoading = false;
      });
    }
  }

  async fetchTokens(): Promise<void> {
    if (!this.address || !this.chainId || !this.walletProvider) return;

    this.isLoading = true;
    this.error = null;

    try {
      const networkParams = this.getNetworkParams();
      if (!networkParams) {
        throw new Error('Unsupported network');
      }

      const apiUrl = `https://deep-index.moralis.io/api/v2/${this.address}/erc20`;

      const queryParams = new URLSearchParams({
        chain: networkParams.chainName,
      });

      const response = await fetch(`${apiUrl}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': Moralis_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: TokenResponse[] = await response.json();
      const userTokens: TokenInfo[] = [];

      for (const token of data) {
        if (token.balance && parseFloat(token.balance) > 0) {
          const decimals = parseInt(token.decimals || '18');
          const formattedBalance = ethers.formatUnits(token.balance, decimals);

          userTokens.push({
            address: token.token_address,
            name: token.name || 'Unknown Token',
            symbol: token.symbol || '???',
            balance: formattedBalance,
            decimals: decimals,
            thumbnail: token.thumbnail || null,
            logo: token.logo || null,
            uuid: getUniqueId(),
          });
        }
      }

      runInAction(() => {
        this.tokens = userTokens;
        this.isLoading = false;
      });
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  }

  getNetworkParams(): NetworkParams | undefined {
    const networkMapping: Record<number, NetworkParams> = {
      1: { chainName: 'eth', explorer: 'https://etherscan.io', currency: 'ETH' },
      137: { chainName: 'polygon', explorer: 'https://polygonscan.com', currency: 'MATIC' },
      56: { chainName: 'bsc', explorer: 'https://bscscan.com', currency: 'BNB' },
      43114: { chainName: 'avalanche', explorer: 'https://snowtrace.io', currency: 'AVAX' },
      42161: { chainName: 'arbitrum', explorer: 'https://arbiscan.io', currency: 'ARB' },
      10: { chainName: 'optimism', explorer: 'https://optimistic.etherscan.io', currency: 'OP' },
      250: { chainName: 'fantom', explorer: 'https://ftmscan.com', currency: 'FTM' },
    };

    return this.chainId !== null ? networkMapping[this.chainId] : undefined;
  }
}

const walletStore = new WalletStore();
export default walletStore;

import { makeAutoObservable, runInAction } from 'mobx';
import { ethers } from 'ethers';
import Constants from 'expo-constants';

interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  decimals?: number;
  thumbnail?: string | null;
  logo?: string | null;
}

interface NetworkParams {
  chainName: string;
  explorer: string;
  currency: string;
}

interface TokenResponse {
  token_address: string;
  name?: string;
  symbol?: string;
  balance?: string;
  decimals?: string;
  thumbnail?: string;
  logo?: string;
}

const minABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: 'decimals', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: 'symbol', type: 'string' }],
    type: 'function',
  },
];

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
        },
        {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          name: 'USD Coin',
          symbol: 'USDC',
          balance: '67.89',
          decimals: 6,
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
          'X-API-Key': Constants.expoConfig?.extra?.MORALIS_API_KEY,
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
          });
        }
      }

      runInAction(() => {
        this.tokens = userTokens;
        this.isLoading = false;
      });
    } catch (error) {
      console.error('Error fetching tokens:', error);

      await this.fetchPopularTokens();
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

  async fetchPopularTokens(): Promise<void> {
    try {
      const tokenAddresses: Record<number, Array<{ address: string; name: string }>> = {
        1: [
          // Ethereum Mainnet
          { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether USD' }, // USDT
          { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USD Coin' }, // USDC
          { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', name: 'Wrapped BTC' }, // WBTC
          { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Dai Stablecoin' }, // DAI
        ],
        137: [
          // Polygon
          { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', name: 'Tether USD' }, // USDT
          { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', name: 'USD Coin' }, // USDC
          { address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', name: 'Wrapped BTC' }, // WBTC
          { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', name: 'Dai Stablecoin' }, // DAI
        ],
      };

      if (!this.chainId || !this.address) {
        throw new Error('Chain ID or address is missing');
      }

      const ethersProvider = new ethers.BrowserProvider(this.walletProvider);
      const tokensToCheck = tokenAddresses[this.chainId] || [];
      const userTokens: TokenInfo[] = [];

      for (const token of tokensToCheck) {
        const contract = new ethers.Contract(token.address, minABI, ethersProvider);
        try {
          const balance = await contract.balanceOf(this.address);

          if (Number(balance) > 0) {
            const decimals = await contract.decimals();
            const symbol = await contract.symbol();
            const formattedBalance = ethers.formatUnits(balance, decimals);

            userTokens.push({
              address: token.address,
              name: token.name,
              symbol,
              balance: formattedBalance,
              decimals: Number(decimals),
            });
          }
        } catch (err) {
          console.error(`Error checking token ${token.name}:`, err);
        }
      }

      runInAction(() => {
        this.tokens = userTokens;
        this.isLoading = false;
        if (!userTokens.length) {
          this.error = 'No tokens found or unable to connect to token API';
        }
      });
    } catch (error) {
      runInAction(() => {
        console.error('Error in fallback token fetch:', error);
        this.error = 'Failed to fetch tokens';
        this.isLoading = false;
      });
    }
  }
}

const walletStore = new WalletStore();
export default walletStore;

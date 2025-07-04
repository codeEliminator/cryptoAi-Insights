export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  decimals?: number;
  thumbnail?: string | null;
  logo?: string | null;
  uuid: string;
}

export interface NetworkParams {
  chainName: string;
  explorer: string;
  currency: string;
}

export interface TokenResponse {
  token_address: string;
  name?: string;
  symbol?: string;
  balance?: string;
  decimals?: string;
  thumbnail?: string;
  logo?: string;
}

export interface WalletStore {
  address: `0x${string}` | null | undefined;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
  tokens: TokenInfo[];
  isLoading: boolean;
  error: string | null;
  walletInfo: Record<string, any> | null;

  setWalletState(
    address: `0x${string}` | null | undefined,
    chainId: number | null,
    isConnected: boolean,
    walletInfo: Record<string, any> | null
  ): void;
  forceLogin(): void;
  setProvider(provider: any): void;
  fetchBalance(): Promise<void>;
  fetchTokens(): Promise<void>;
  getNetworkParams(): NetworkParams | undefined;
  fetchPopularTokens(): Promise<void>;
}

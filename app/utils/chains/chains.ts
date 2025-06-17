const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

const polygon = {
  chainId: 137,
  name: "Polygon",
  currency: "MATIC",
  explorerUrl: "https://polygonscan.com",
  rpcUrl: "https://polygon-rpc.com",
};
const bsc = {
  chainId: 56,
  name: "BSC",
  currency: "BNB",
  explorerUrl: "https://bscscan.com",
  rpcUrl: "https://bsc-dataseed.binance.org",
};
const avalanche = {
  chainId: 43114,
  name: "Avalanche",
  currency: "AVAX",
  explorerUrl: "https://snowtrace.io",
  rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
};
const arbitrum = {
  chainId: 42161,
  name: "Arbitrum",
  currency: "ARB",
  explorerUrl: "https://arbiscan.io",
  rpcUrl: "https://arb1.arbitrum.io/rpc",
};
const optimism = {
  chainId: 10,
  name: "Optimism",
  currency: "OP",
  explorerUrl: "https://optimistic.etherscan.io",
  rpcUrl: "https://mainnet.optimism.io",
};
const fantom = {
  chainId: 250,
  name: "Fantom",
  currency: "FTM",
  explorerUrl: "https://ftmscan.com",
  rpcUrl: "https://rpc.fantom.network",
};
const base = {
  chainId: 8453,
  name: "Base",
  currency: "ETH",
  explorerUrl: "https://basescan.org",
  rpcUrl: "https://mainnet.base.org",
};
export { mainnet, polygon, bsc, avalanche, arbitrum, optimism, fantom, base };
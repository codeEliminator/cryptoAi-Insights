import { CryptoCurrency } from '@/app/types/types';

export const getFilteredData = (searchQuery: string, allCryptoData: CryptoCurrency[]) => {
  if (searchQuery.trim() === '') {
    return allCryptoData;
  }
  const query = searchQuery.toLowerCase();
  return allCryptoData.filter(
    item => item.name.toLowerCase().includes(query) || item.symbol.toLowerCase().includes(query)
  );
};

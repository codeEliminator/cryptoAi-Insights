import { CryptoCurrency } from '@/app/types/types';

export const getSuggestions = (searchQuery: string, allCryptoData: CryptoCurrency[]) => {
  if (searchQuery.trim() === '') return [];

  const query = searchQuery.toLowerCase();
  return allCryptoData
    .filter(
      item => item.name.toLowerCase().includes(query) || item.symbol.toLowerCase().includes(query)
    )
    .slice(0, 5);
};

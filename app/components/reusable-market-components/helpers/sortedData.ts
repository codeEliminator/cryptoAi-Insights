import { CryptoCurrency } from '@/app/types/types';
import { SortByType } from '@/app/(tabs)/market';
import { SortOrderType } from '@/app/(tabs)/market';

export function sortedData(
  filteredData: CryptoCurrency[],
  sortBy: SortByType,
  sortOrder: SortOrderType
) {
  if (filteredData.length === 0) return [];

  const dataToSort = [...filteredData];

  dataToSort.sort((a, b) => {
    const aValue = a[sortBy] || 0;
    const bValue = b[sortBy] || 0;

    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  return dataToSort;
}

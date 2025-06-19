const getActionColor = (action: string): string => {
  switch (action) {
    case 'buy': return '#4CAF50';
    case 'sell': return '#FF5722';
    case 'hold': return '#FFC107';
    default: return '#FFFFFF';
  }
};

export default getActionColor;
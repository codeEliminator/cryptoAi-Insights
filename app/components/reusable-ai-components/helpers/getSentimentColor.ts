const getSentimentColor = (sentiment: number): string => {
  if (sentiment >= 75) return '#4CAF50';
  if (sentiment >= 50) return '#8BC34A';
  if (sentiment >= 25) return '#FFC107';
  return '#FF5722';
};
export default getSentimentColor;
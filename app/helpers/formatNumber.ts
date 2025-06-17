const formatNumber = (num: string | null): string => {
  if (!num) return '0.0000';
  return parseFloat(num).toFixed(4);
};

export default formatNumber;
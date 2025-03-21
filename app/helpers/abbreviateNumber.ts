const abbreviateNumber = (value: number) => {
  const SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];
  const tier = Math.floor(Math.log10(Math.abs(value)) / 3);
  if (tier === 0) return value.toString();
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;
  return scaled.toFixed(1) + suffix;
}

export default abbreviateNumber
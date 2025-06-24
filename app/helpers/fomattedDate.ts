const formattedDate = (language: string) => {
  return new Date().toLocaleDateString(language + '-' + language.toUpperCase(), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
export default formattedDate;

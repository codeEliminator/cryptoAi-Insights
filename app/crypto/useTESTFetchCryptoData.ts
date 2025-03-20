// useEffect(() => {
//     const fetchChartData = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         const response = await fetch(
//           `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${timeframe}`
//         );
        
//         if (!response.ok) {
//           throw new Error('Не удалось получить данные для графика');
//         }
        
//         const data = await response.json();
        
//         // Данные приходят в формате [timestamp, price]
//         const prices: [number, number][] = data.prices;
        
//         // Преобразуем данные в формат для графика
//         const formattedData = prices.map(([timestamp, price]) => {
//           const date = new Date(timestamp);
//           return {
//             date: formatDate(date, timeframe),
//             price: parseFloat(price.toFixed(2))
//           };
//         });
        
//         setChartData(formattedData);
//       } catch (err) {
//         console.error('Ошибка при загрузке данных графика:', err);
//         setError('Не удалось загрузить данные для графика');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     // fetchChartData();
//   }, [coinId, timeframe]);
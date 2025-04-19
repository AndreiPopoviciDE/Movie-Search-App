export  const parseDecade = (decade: string) => {
    const year = parseInt(decade.replace('s', ''), 10);
    return !isNaN(year) ? year : null;
  };
  
  export const parseRating = (rating: string) => {
    if (rating.includes('+')) {
      return { min: parseInt(rating.replace('+', ''), 10), max: null };
    }
    if (rating.includes('-')) {
      const [minStr, maxStr] = rating.split('-');
      return { min: Number(minStr), max: Number(maxStr) };
    }
    return { min: null, max: null };
  };
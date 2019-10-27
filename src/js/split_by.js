export const splitBy = (str, splitters) => {
  return str.split('').reduce(
    (acc, el) => {
      if (splitters.includes(el) && acc.temp.length === 0) {
        acc.res.push(el);
      } else if (splitters.includes(el) && acc.temp.length > 0) {
        acc.res.push(acc.temp);
        acc.res.push(el);
        acc.temp = '';
      } else {
        acc.temp += el;
      }

      return acc;
    },
    { temp: '', res: [] }
  ).res;
};

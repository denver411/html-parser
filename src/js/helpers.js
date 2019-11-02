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

export const getElementsByClassName = (node, name) => {
  const findNode = (className, [x, ...xs], acc) => {
    if (x == null) {
      return acc;
    }

    return findNode(
      className,
      [...xs, ...x.children.filter(el => typeof el !== 'string')],
      x.attrs.some(attr => attr.name === 'class' && attr.value.includes(className))
        ? [...acc, x]
        : acc
    );
  };

  return findNode(name, node.children, []);
};

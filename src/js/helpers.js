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

export const tokenize = (str, tokens) => {
  const splitters = Object.entries(tokens).reduce(
    (acc, [value, key]) => ({ ...acc, [key]: value }),
    {}
  );

  return str.split('').reduce(
    (acc, el) => {
      if (splitters[el] != null) {
        if (acc.temp.length === 0) {
          acc.res.push({ name: splitters[el], value: el });
        } else {
          acc.res.push({ name: splitters.content, value: acc.temp });
          acc.res.push({ name: splitters[el], value: el });
          acc.temp = '';
        }
      } else {
        acc.temp += el;
      }

      return acc;
    },
    { temp: '', res: [] }
  ).res;
};

function getElementsByClassName(name) {
  const findNode = (className, nodes) => {
    if (!Array.isArray(nodes)) {
      return null;
    }

    return nodes.filter(el => el.class != null && el.class.includes(className)).length > 0
      ? nodes.filter(el => el.class.includes(className))
      : nodes.reduce((acc, item) => {
          const res = findNode(className, item.content) || [];
          return res.length > 0 ? [...acc, ...res] : acc;
        }, []);
  };

  return findNode(name, this.children);
}

export default getElementsByClassName;

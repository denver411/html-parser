/* eslint-disable no-plusplus */
export const createNode = (tag = '', className = undefined, content = []) => {
  if (className == null) {
    return {
      tag,
      content,
    };
  }
  return {
    tag,
    className,
    content,
  };
};

export const getCurrent = (depth, start) => {
  let current = start;

  for (let j = 0; j < depth; j++) {
    current = current[current.length - 1].content;
  }

  return current;
};

export function getElementsByClassName(name) {
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

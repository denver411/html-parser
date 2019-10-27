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
      return [];
    }

    return [
      ...nodes.filter(
        el =>
          el.attrs.filter(attr => attr.name === 'class' && attr.value.includes(className)).length >
          0
      ),
      ...nodes.map(item => [...findNode(className, item.children)]),
    ].flat();
  };

  return findNode(name, this.children);
}

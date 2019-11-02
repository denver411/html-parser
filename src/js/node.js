export const make = (tag = '', attrs = [], children = []) => ({
  tag,
  attrs,
  children,
});

export const addAttr = (node, attr) => ({ ...node, attrs: [attr, ...node.attrs] });

export const addChild = (parentNode, childNode) => ({
  ...parentNode,
  children: [...parentNode.children, childNode],
});

const createNode = (tag = '', className = undefined, content = []) => {
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

export default createNode;

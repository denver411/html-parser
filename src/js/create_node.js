const createNode = (tag = '', className = undefined, content = []) =>
  className == null
    ? {
        tag,
        content,
      }
    : {
        tag,
        className,
        content,
      };

export default createNode;

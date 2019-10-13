const Tags = () => {
  const _stack = [];

  return {
    get length() {
      return _stack.length;
    },
    get last() {
      return _stack[this.length - 1];
    },
    get get() {
      return _stack;
    },
    add(item) {
      _stack.push(item);
    },
    get lastIsStartTag() {
      return this.last === '<';
    },
    removeLast() {
      return _stack.pop();
    },
    clean() {
      _stack = [];
    },
  };
};

export default Tags;

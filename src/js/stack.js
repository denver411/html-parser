const Stack = () => {
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
    removeLast() {
      return _stack.pop();
    },
    clean() {
      _stack = [];
    },
  };
};

export default Stack;

const Symbols = () => {
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
    get lastIsOpenTag() {
      return this.last === '<';
    },
    get lastIsCloseTag() {
      return [_stack[this.length - 2], _stack[this.length - 1]].join('') === '</';
    },
    removeLast() {
      return _stack.pop();
    },
    removeLastTwo() {
      _stack.pop();
      _stack.pop();
      return;
    },
    clean() {
      _stack = [];
    },
  };
};

export default Symbols;

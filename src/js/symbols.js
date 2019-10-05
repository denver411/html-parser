const Symbols = () => ({
  _stack: [],
  get length() {
    return this._stack.length;
  },
  get last() {
    return this._stack[this.length - 1];
  },
  get get() {
    return this._stack;
  },
  add(item) {
    this._stack.push(item);
  },
  remove() {
    return this._stack.pop();
  },
  clean() {
    this._stack = [];
  },
});

export default Symbols;

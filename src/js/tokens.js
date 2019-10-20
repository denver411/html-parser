const Tokens = () => ({
  _str: '',
  _stack: [],
  _SYMBOLS: ['<', '>', ' ', '"', '/', '='],
  getTokens(str) {
    this._str = str;
    let lastSym = 0;

    for (let i = 0; i < this._str.length; i++) {
      if (this._SYMBOLS.includes(this._str[i])) {
        if (i - lastSym > 1) {
          this._stack.push(this._str.slice(lastSym + 1, i));
        }
        this._stack.push(this._str[i]);
        lastSym = i;
      }
    }

    return this._stack;
  },
});

export default Tokens;

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
  // get get() {
  //   return this._stack;
  // },
  // get length() {
  //   return this._stack.length;
  // },
  // get last() {
  //   return this._stack[this.length - 1];
  // },
  // add(item) {
  //   this._stack.push(item);
  // },
  // remove() {
  //   return this._stack.pop();
  // },
  // clean() {
  //   this._stack = [];
  // },
});

export default Tokens;

// const tokens = Tokens();
// const htmlStr =
//   '<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta http-equiv="X-UA-Compatible" content="ie=edge" /><title>HTML parser v.0.0.1</title></head><body style="background-color:dimgray"></body></html>';

// console.log(tokens.getTokens(htmlStr));

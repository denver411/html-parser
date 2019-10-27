export const stack = (() => {
  const _stack = [];
  const length = () => {
    return _stack.length;
  };
  const last = () => {
    return _stack[_stack.length - 1];
  };
  const get = () => {
    return _stack;
  };
  const add = item => {
    _stack.push(item);
  };
  const removeLast = () => {
    return _stack.pop();
  };
  const clean = () => {
    _stack = [];
  };

  return {
    length,
    last,
    get,
    add,
    removeLast,
    clean,
  };
})();

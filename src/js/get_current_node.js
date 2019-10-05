/* eslint-disable no-plusplus */
const getCurrent = (stack, start) => {
  let current = start;

  for (let j = 0; j < stack.length - 1; j++) {
    current = current[current.length - 1].content;
  }

  return current;
};

export default getCurrent;

import { createNode, getCurrent, getElementsByClassName } from './helpers';
import Tokens from './tokens';
import Stack from './stack';

const result = {
  children: [],
  getElementsByClassName,
};

const TAG_NAMES = ['html', 'div', 'head', 'title', 'body'];
const ATTRS = ['class'];

const tokens = Tokens();
const stack = Stack();
const states = {
  content: 'content',
  attr: 'attr',
  openTag: 'openTag',
  closeTag: 'closeTag',
};
const state = {
  mode: states.content, // type of parsing (openTag,closeTag/attr/content)
  currentNode: result.children,
  lastAttr: ATTRS[0],
  content: [],
};

const parser = str => {
  const htmlStr = str.trim();
  if (htmlStr === '' || typeof htmlStr !== 'string') {
    throw new Error('Argument is not a string or empty');
  }
  if (htmlStr.slice(0, 5) !== '<html') {
    throw new Error('Wrong string');
  }

  const tokensStack = tokens.getTokens(htmlStr);
  const updateCurrent = () => {
    state.currentNode = getCurrent(stack.length, result.children);
  };

  // console.log(tokensStack);
  tokensStack.forEach((el, idx, arr) => {
    const nextEl = tokensStack[idx + 1];
    const prevEl = tokensStack[idx - 1];
    const current = state.currentNode;

    console.log('%c%s', 'color: red;', '\nstart iteration');
    console.log('%c%s', 'color: green;', el);
    console.log(`mode before: ${state.mode}`);
    console.log('%c%s', 'color: grey;', JSON.stringify(state.content));
    switch (state.mode) {
      case states.attr:
        if (el === '"' && TAG_NAMES.includes(stack.last)) {
          current[current.length - 1][state.lastAttr] = nextEl;
          stack.add('"');
        }
        if (el === '"' && stack.last === '"') {
          stack.removeLast();
          state.mode = states.openTag;
        }
        break;

      case states.closeTag:
        if (prevEl === '/' && !TAG_NAMES.includes(el)) {
          state.mode = states.content;
          break;
        }
        if (el === '>' && stack.last !== prevEl) {
          throw new Error('Unpaired tag');
        }
        if (el === '>' && stack.last == prevEl) {
          stack.removeLast();
          state.mode = states.content;
          updateCurrent();
        }
        break;

      case states.openTag:
        if (TAG_NAMES.includes(el)) {
          stack.add(el);
          current.push(createNode());
          current[current.length - 1].tag = el;
        }
        if (el === '=' && ATTRS.includes(prevEl)) {
          state.lastAttr = prevEl;
          state.mode = states.attr;
        }
        if (el === '>' && TAG_NAMES.includes(stack.last)) {
          state.mode = states.content;
          state.currentNode = current[current.length - 1].content;
        }
        if (el === '>' && !TAG_NAMES.includes(stack.last)) {
          throw new Error('Tag params parse error');
        }
        break;

      case states.content:
        if (el === '<') {
          if (TAG_NAMES.includes(nextEl)) {
            state.mode = states.openTag;
          } else if (nextEl === '/') {
            state.mode = states.closeTag;
          } else {
            state.content.push(el);
          }
        } else {
          state.content.push(el);
        }
        break;

      default:
    }
    // console.log(stack.get);
    // console.log('%c%s', 'color: grey;', JSON.stringify(state.currentNode, null, 2));
    // console.log(JSON.stringify(result.children, null, 2));
  });

  return result;
};

export default parser;

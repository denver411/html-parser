import { createNode, getCurrent, getElementsByClassName } from './helpers';
import { splitBy } from './split_by';
import { stack } from './stack';
import * as Node from './node';

const TAG_NAMES = [
  'html',
  'div',
  'head',
  'title',
  'body',
  'section',
  'header',
  'span',
  'article',
  'h2',
  'h3',
];
const ATTRS = ['class', 'lang', 'style'];
const SPLITTERS = { openTag: '<', closeTag: '>', gap: ' ', quote: '"', slash: '/', eq: '=' };
const SPLITTERS_VALUES = Object.values(SPLITTERS);
const STATES = {
  content: 'content',
  attr: 'attr',
  attrNameQuote: 'attrNameQuote',
  attrName: 'attrName',
  tag: 'tag',
  openTag: 'openTag',
  closeTag: 'closeTag',
};
const initialState = (() => {
  const mode = STATES.content;
  const result = Node.make('document');
  const currentNode = stack.last() || result;
  const temp = [];

  return {
    mode,
    result,
    currentNode,
    temp,
    stack,
  };
})();

const updateCurrentNode = state => {
  state.currentNode = state.stack.last() || state.stack.result;
};

const createNewNode = (state, tagName) => {
  const currentNode = Node.make(tagName);

  state.currentNode.children.push(currentNode);
  state.stack.add(currentNode);
};

const createNodeTextContent = state => {
  const content = state.temp.join('').trim();

  content === '' ? null : state.currentNode.children.push(content);
  state.temp.length = 0;
};

const saveTextContent = (state, content) => {
  content.forEach(text => {
    state.temp.push(text);
  });
};

export const parser = str => {
  if (str === '' || typeof str !== 'string') {
    throw new Error('Argument is not a string or empty');
  }

  const tokens = splitBy(str, SPLITTERS_VALUES);
  // console.log(tokens);

  return tokens.reduce((state, el) => {
    // console.log('%c%s', 'color: green;', el);
    // console.log('%c%s', 'color: red;', 'state before');
    // console.log(`mode: ${state.mode}`);
    // console.log('%c%s', 'color: grey;', JSON.stringify(state.currentNode));
    // console.log(JSON.stringify(state.temp));
    // console.log(JSON.stringify(state.stack.get()));
    switch (state.mode) {
      case STATES.content:
        if (el === SPLITTERS.openTag) {
          state.mode = STATES.tag;
        } else {
          state.temp.push(el);
        }

        return state;

      case STATES.tag:
        if (TAG_NAMES.includes(el) && state.temp.length === 0) {
          createNewNode(state, el);
          updateCurrentNode(state);
          state.mode = STATES.openTag;
        } else if (TAG_NAMES.includes(el) && state.temp.length > 0) {
          createNodeTextContent(state);
          createNewNode(state, el);
          updateCurrentNode(state);
          state.mode = STATES.openTag;
        } else if (el === SPLITTERS.slash) {
          state.mode = STATES.closeTag;
        } else if (el === SPLITTERS.closeTag) {
          state.mode = STATES.content;
        } else {
          saveTextContent(state, [SPLITTERS.openTag, el]);
          state.mode = STATES.content;
        }

        return state;

      case STATES.closeTag:
        if (TAG_NAMES.includes(el) && state.temp.length === 0) {
          const lastNode = state.stack.removeLast();
          if (el !== lastNode.tag) {
            throw new Error(`Unpaired tags ${el} and ${lastNode.tag}`);
          }
          updateCurrentNode(state);
          state.mode = STATES.tag;
        } else if (TAG_NAMES.includes(el) && state.temp.length > 0) {
          const lastNode = state.stack.removeLast();
          if (el !== lastNode.tag) {
            throw new Error(`Unpaired tags ${el} and ${lastNode.tag}`);
          }
          createNodeTextContent(state);
          updateCurrentNode(state);
          state.mode = STATES.tag;
        } else {
          saveTextContent([SPLITTERS.openTag, SPLITTERS.slash, el]);
          state.mode = STATES.content;
        }

        return state;

      case STATES.openTag:
        if (el === SPLITTERS.closeTag) {
          state.mode = STATES.content;
        } else if (ATTRS.includes(el)) {
          state.mode = STATES.attr;
          Node.addAttr(state.currentNode, { name: el });
        } else if (el !== SPLITTERS.gap) {
          throw new Error(`Wrong attribute name ${el.toUpperCase()}`);
        }
        return state;

      case STATES.attr:
        if (el === SPLITTERS.eq) {
          state.mode = STATES.attrNameQuote;
        } else {
          throw new Error(`Wrong symbol ${el.toUpperCase()} after attribute name`);
        }
        return state;

      case STATES.attrNameQuote:
        if (el === SPLITTERS.quote) {
          state.mode = STATES.attrName;
        } else {
          throw new Error(`Wrong symbol ${el.toUpperCase()} before attribute value`);
        }
        return state;

      case STATES.attrName:
        if (el === SPLITTERS.quote) {
          state.mode = STATES.openTag;
        } else if (SPLITTERS_VALUES.includes(el) && el !== SPLITTERS.gap) {
          throw new Error(`Attribute's name contains ${el}`);
        } else {
          Node.addAttr(state.currentNode, { value: el });
        }
        return state;

      default:
        return state;
    }
  }, initialState).result;
};

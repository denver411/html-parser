import { splitBy, getElementsByClassName } from './helpers';
import * as Node from './node';
import * as Attr from './attr';

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
  const currentNode = null;
  const currentAttr = null;
  const currentText = [];
  const stack = [];

  return {
    mode,
    result,
    currentNode,
    currentAttr,
    currentText,
    stack,
  };
})();

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
    // console.log('%c%s', 'color: grey;', JSON.stringify(state.currentAttr));
    // console.log('%c%s', 'color: grey;', JSON.stringify(state.currentText));
    // console.log('%c%s', 'color: grey;', JSON.stringify(state.stack));
    // console.log('%c%s', 'color: grey;', JSON.stringify(state));
    switch (state.mode) {
      case STATES.content:
        return el === SPLITTERS.openTag
          ? { ...state, mode: STATES.tag }
          : { ...state, currentText: [...state.currentText, el] };

      case STATES.tag:
        if (TAG_NAMES.includes(el)) {
          return {
            ...state,
            currentNode: Node.make(el),
            mode: STATES.openTag,
          };
        } else if (el === SPLITTERS.slash) {
          return {
            ...state,
            mode: STATES.closeTag,
          };
        } else if (el === SPLITTERS.closeTag) {
          return {
            ...state,
            mode: STATES.content,
          };
        } else {
          return {
            ...state,
            mode: STATES.content,
            currentText: [...state.currentText, SPLITTERS.openTag, el],
          };
        }

      case STATES.openTag:
        if (el === SPLITTERS.closeTag) {
          return {
            ...state,
            mode: STATES.content,
            stack: [state.currentNode, ...state.stack],
            currentNode: null,
          };
        } else if (ATTRS.includes(el)) {
          return {
            ...state,
            mode: STATES.attr,
            currentAttr: Attr.make(el),
          };
        } else if (el !== SPLITTERS.gap) {
          throw new Error(`Wrong attribute name ${el.toUpperCase()}`);
        } else {
          return state;
        }

      case STATES.attr:
        if (el === SPLITTERS.eq) {
          return { ...state, mode: STATES.attrNameQuote };
        } else {
          throw new Error(`Wrong symbol ${el.toUpperCase()} after attribute name`);
        }

      case STATES.attrNameQuote:
        if (el === SPLITTERS.quote) {
          return { ...state, mode: STATES.attrName };
        } else {
          throw new Error(`Wrong symbol ${el.toUpperCase()} before attribute value`);
        }
      case STATES.attrName:
        if (el === SPLITTERS.quote) {
          return {
            ...state,
            mode: STATES.openTag,
            currentNode: Node.addAttr(state.currentNode, state.currentAttr),
            currentAttr: null,
          };
        } else if (SPLITTERS_VALUES.includes(el) && el !== SPLITTERS.gap) {
          throw new Error(`Attribute's name contains ${el}`);
        } else {
          return { ...state, currentAttr: Attr.addValue(state.currentAttr, el) };
        }

      case STATES.closeTag:
        if (TAG_NAMES.includes(el)) {
          let [lastNode, parentNode, ...xs] = state.stack;

          if (el !== lastNode.tag) {
            throw new Error(`Unpaired tags ${el} and ${lastNode.tag}`);
          }
          const textContent = state.currentText.join('').trim();
          if (textContent.length > 0) {
            lastNode = Node.addChild(lastNode, textContent);
          }
          return parentNode == null
            ? {
                ...state,
                stack: [],
                currentText: [],
                mode: STATES.tag,
                result: Node.addChild(state.result, lastNode),
              }
            : {
                ...state,
                stack: [Node.addChild(parentNode, lastNode), ...xs],
                currentText: [],
                mode: STATES.tag,
              };
        } else {
          return {
            ...state,
            mode: STATES.content,
            currentText: [...state.currentText, SPLITTERS.openTag, SPLITTERS.slash, el],
          };
        }

      default:
        return state;
    }
  }, initialState).result;
};

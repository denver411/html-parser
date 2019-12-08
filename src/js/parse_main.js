import { tokenize } from './helpers';
import * as Node from './node';
import * as StateMachine from './state_machine';
export { getElementsByClassName } from './helpers';

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
const SPLITTERS = {
  openTag: '<',
  closeTag: '>',
  gap: ' ',
  quote: '"',
  slash: '/',
  eq: '=',
  content: 'content',
};
const TOKEN_NAMES = Object.entries(SPLITTERS).reduce(
  (acc, [name]) => ({ ...acc, [name]: name }),
  {}
);

const STATES = {
  content: 'content',
  attr: 'attr',
  attrNameQuote: 'attrNameQuote',
  attrName: 'attrName',
  tag: 'tag',
  openTag: 'openTag',
  closeTag: 'closeTag',
};
const CONFIG = {
  ATTRS,
  SPLITTERS,
  STATES,
  TAG_NAMES,
  TOKEN_NAMES,
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

export const parse = str => {
  if (str === '' || typeof str !== 'string') {
    throw new Error('Argument is not a string or empty');
  }
  const tokens = tokenize(str, SPLITTERS);

  return tokens.reduce((state, el) => {
    switch (state.mode) {
      case STATES.content:
        return StateMachine.fromContentState(el, state, CONFIG);

      case STATES.tag:
        return StateMachine.fromTagState(el, state, CONFIG);

      case STATES.openTag:
        return StateMachine.fromOpenTagState(el, state, CONFIG);

      case STATES.attr:
        return StateMachine.fromAttrState(el, state, CONFIG);

      case STATES.attrNameQuote:
        return StateMachine.fromAttrNameQuoteState(el, state, CONFIG);

      case STATES.attrName:
        return StateMachine.fromAttrName(el, state, CONFIG);

      case STATES.closeTag:
        return StateMachine.fromCloseTagState(el, state, CONFIG);

      default:
        return state;
    }
  }, initialState).result;
};

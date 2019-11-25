import * as Node from './node';
import * as Attr from './attr';

export const fromContentState = (el, state, config) =>
  el === config.SPLITTERS.openTag
    ? { ...state, mode: config.STATES.tag }
    : { ...state, currentText: [...state.currentText, el] };

export const fromTagState = (el, state, config) => {
  if (config.TAG_NAMES.includes(el)) {
    return {
      ...state,
      currentNode: Node.make(el),
      mode: config.STATES.openTag,
    };
  } else if (el === config.SPLITTERS.slash) {
    return {
      ...state,
      mode: config.STATES.closeTag,
    };
  } else if (el === config.SPLITTERS.closeTag) {
    return {
      ...state,
      mode: config.STATES.content,
    };
  } else {
    return {
      ...state,
      mode: config.STATES.content,
      currentText: [...state.currentText, config.SPLITTERS.openTag, el],
    };
  }
};

export const fromOpenTagState = (el, state, config) => {
  if (el === config.SPLITTERS.closeTag) {
    return {
      ...state,
      mode: config.STATES.content,
      stack: [state.currentNode, ...state.stack],
      currentNode: null,
    };
  } else if (config.ATTRS.includes(el)) {
    return {
      ...state,
      mode: config.STATES.attr,
      currentAttr: Attr.make(el),
    };
  } else if (el !== config.SPLITTERS.gap) {
    throw new Error(`Wrong attribute name ${el.toUpperCase()}`);
  } else {
    return state;
  }
};

export const fromAttrState = (el, state, config) => {
  if (el === config.SPLITTERS.eq) {
    return { ...state, mode: config.STATES.attrNameQuote };
  } else {
    throw new Error(`Wrong symbol ${el.toUpperCase()} after attribute name`);
  }
};

export const fromAttrNameQuoteState = (el, state, config) => {
  if (el === config.SPLITTERS.quote) {
    return { ...state, mode: config.STATES.attrName };
  } else {
    throw new Error(`Wrong symbol ${el.toUpperCase()} before attribute value`);
  }
};

export const fromAttrName = (el, state, config) => {
  if (el === config.SPLITTERS.quote) {
    return {
      ...state,
      mode: config.STATES.openTag,
      currentNode: Node.addAttr(state.currentNode, state.currentAttr),
      currentAttr: null,
    };
  } else if (config.SPLITTERS_VALUES.includes(el) && el !== config.SPLITTERS.gap) {
    throw new Error(`Attribute's name contains ${el}`);
  } else {
    return { ...state, currentAttr: Attr.addValue(state.currentAttr, el) };
  }
};

export const fromCloseTagState = (el, state, config) => {
  if (config.TAG_NAMES.includes(el)) {
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
          mode: config.STATES.tag,
          result: Node.addChild(state.result, lastNode),
        }
      : {
          ...state,
          stack: [Node.addChild(parentNode, lastNode), ...xs],
          currentText: [],
          mode: config.STATES.tag,
        };
  } else {
    return {
      ...state,
      mode: config.STATES.content,
      currentText: [...state.currentText, config.SPLITTERS.openTag, config.SPLITTERS.slash, el],
    };
  }
};

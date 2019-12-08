import * as Node from './node';
import * as Attr from './attr';

export const fromContentState = (token, state, config) =>
  token.name === config.TOKEN_NAMES.openTag
    ? { ...state, mode: config.STATES.tag }
    : { ...state, currentText: [...state.currentText, token.value] };

export const fromTagState = (token, state, config) => {
  if (config.TAG_NAMES.includes(token.value)) {
    return {
      ...state,
      currentNode: Node.make(token.value),
      mode: config.STATES.openTag,
    };
  } else if (token.name === config.TOKEN_NAMES.slash) {
    return {
      ...state,
      mode: config.STATES.closeTag,
    };
  } else if (token.name === config.TOKEN_NAMES.closeTag) {
    return {
      ...state,
      mode: config.STATES.content,
    };
  } else {
    return {
      ...state,
      mode: config.STATES.content,
      currentText: [...state.currentText, config.SPLITTERS.openTag, token.value],
    };
  }
};

export const fromOpenTagState = (token, state, config) => {
  if (token.name === config.TOKEN_NAMES.closeTag) {
    return {
      ...state,
      mode: config.STATES.content,
      stack: [state.currentNode, ...state.stack],
      currentNode: null,
    };
  } else if (config.ATTRS.includes(token.value)) {
    return {
      ...state,
      mode: config.STATES.attr,
      currentAttr: Attr.make(token.value),
    };
  } else if (token.name !== config.TOKEN_NAMES.gap) {
    throw new Error(`Wrong attribute name ${token.value.toUpperCase()}`);
  } else {
    return state;
  }
};

export const fromAttrState = (token, state, config) => {
  if (token.name === config.TOKEN_NAMES.eq) {
    return { ...state, mode: config.STATES.attrNameQuote };
  } else {
    throw new Error(`Wrong symbol ${token.value.toUpperCase()} after attribute name`);
  }
};

export const fromAttrNameQuoteState = (token, state, config) => {
  if (token.name === config.TOKEN_NAMES.quote) {
    return { ...state, mode: config.STATES.attrName };
  } else {
    throw new Error(`Wrong symbol ${token.value.toUpperCase()} before attribute value`);
  }
};

export const fromAttrName = (token, state, config) => {
  if (token.name === config.TOKEN_NAMES.quote) {
    return {
      ...state,
      mode: config.STATES.openTag,
      currentNode: Node.addAttr(state.currentNode, state.currentAttr),
      currentAttr: null,
    };
  } else if (config.SPLITTERS[token.value] != null && token.name !== config.TOKEN_NAMES.gap) {
    throw new Error(`Attribute's name contains ${token.value}`);
  } else {
    return { ...state, currentAttr: Attr.addValue(state.currentAttr, token.value) };
  }
};

export const fromCloseTagState = (token, state, config) => {
  if (config.TAG_NAMES.includes(token.value)) {
    let [lastNode, parentNode, ...xs] = state.stack;

    if (token.value !== lastNode.tag) {
      throw new Error(`Unpaired tags ${token.value} and ${lastNode.tag}`);
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
      currentText: [
        ...state.currentText,
        config.SPLITTERS.openTag,
        config.SPLITTERS.slash,
        token.value,
      ],
    };
  }
};

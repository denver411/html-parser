import createNode from './create_node';
import getCurrent from './get_current_node';
import Tokens from './tokens';
import Symbols from './symbols';
import Tags from './tags';
import getElementsByClassName from './get_elements_by_class_name';

const parser = str => {
  const htmlStr = str.trim();
  if (htmlStr === '' || typeof htmlStr !== 'string') {
    throw new Error('Argument is not a string or empty');
  }
  if (htmlStr.slice(0, 5) !== '<html') {
    throw new Error('Wrong string');
  }

  const result = {
    children: [],
    getElementsByClassName,
  };

  const tokens = Tokens();
  const symbols = Symbols();
  const tags = Tags();
  const tokensStack = tokens.getTokens(htmlStr);
  const TAG_NAMES = ['html', 'div', 'head', 'title', 'body'];

  const state = {
    nodes: [], // stack for checking tag pairs
    tagType: 'open', // tag type open/close
    namePos: { start: 0, end: 0 }, // class/tag name index
    gapPos: 0,
    mode: '', // type of parsing (tag/class/content)
  };

  let currentNode = result.children;

  const updateCurrent = () => {
    currentNode = getCurrent(state.nodes, result.children);
  };

  console.log(tokensStack);
  return tokensStack.reduce((acc, el, idx, arr) => {
    if (el === '<') {
      symbols.add(el);
      currentNode.push(createNode());
    }

    if (TAG_NAMES.includes(el) && symbols.lastIsOpenTag) {
      currentNode[currentNode.length - 1].tag = el;
    }

    if (el === '/') {
      symbols.add(el);
    }

    if (el === '>' && symbols.lastIsOpenTag) {
      symbols.removeLast();
      currentNode = currentNode[currentNode.length - 1].content;
    }
    if (el === '>' && !symbols.lastIsOpenTag && symbols.lastIsCloseTag) {
      symbols.removeLastTwo();
    }
    console.log('\nstart iteration');
    console.log('%c%s', 'color: green;d', el);
    console.log(symbols.get);
    console.log(JSON.stringify(currentNode));
    console.log(JSON.stringify(acc));

    return acc;
  }, result);
};

export default parser;

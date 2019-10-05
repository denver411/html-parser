import createNode from './create_node';
import getCurrent from './get_current_node';
import Symbols from './symbols';
import getElementsByClassName from './get_elements_by_class_name';

const parser = str => {
  const htmlStr = str.trim();
  if (htmlStr === '' || typeof htmlStr !== 'string') {
    throw new Error('Argument is not a string or empty');
  }
  if (htmlStr[0] !== '<') {
    throw new Error('Wrong string');
  }

  const result = {
    children: [],
    getElementsByClassName,
  };

  const symbols = Symbols();

  const state = {
    nodes: [], // stack for checking tag pairs
    tagType: 'open', // tag type open/close
    namePos: { start: 0, end: 0 }, // class/tag name index
    gapPos: 0,
    mode: '', // type of parsing (tag/class/content)
  };

  let current = result.children;

  const updateCurrent = () => {
    current = getCurrent(state.nodes, result.children);
  };

  const isOpenTag = () => state.mode === 'tag' && state.tagType === 'open' && symbols.last === '<';

  const parseHTML = function(str) {
    for (let i = 0; i < htmlStr.length; i++) {
      switch (htmlStr[i]) {
        case '<':
          if (symbols.length > 0) {
            throw new Error('Invalid tag');
          }
          state.namePos.start = i + 1;

          if (state.mode === 'content' && i - state.namePos.end > 3) {
            const content = htmlStr.slice(state.namePos.end + 2, i).trim();

            if (content.length > 0) {
              current[current.length - 1].content.push(content);
            }
          }

          symbols.add('<');
          state.mode = 'tag';

          if (htmlStr[i + 1] !== '/') {
            state.tagType = 'open';

            if (current.length > 0) {
              current = current[current.length - 1].content;
            }
            current.push(createNode());
          }
          break;
        case '>':
          if (symbols.length === 0 || symbols.last !== '<') {
            throw new Error('Invalid tag');
          }
          if (state.tagType === 'close') {
            const lastOpened = state.nodes.pop();
            updateCurrent();

            const currentClosing = htmlStr.slice(state.namePos.start + 1, i);
            if (lastOpened !== currentClosing) {
              throw new Error('Unclosed tag');
            }
            state.tagType = 'open';
          }

          if (isOpenTag() && current[current.length - 1].tag === '') {
            const tagName = htmlStr.slice(state.namePos.start, i);

            current[current.length - 1].tag = tagName;
            state.nodes.push(tagName);
            updateCurrent();
          }
          if (state.mode === 'tag') {
            state.namePos.end = i - 1;
          }
          state.mode = 'content';
          symbols.clean();
          break;
        case '"':
          if (state.mode !== 'content' && symbols.last === '<') {
            symbols.add('"');
          } else if (state.mode !== 'content' && symbols.length > 1 && symbols.last === '"') {
            symbols.remove();
            if (state.mode === 'class') {
              state.namePos.end = i - 1;
              current[current.length - 1].class = htmlStr.slice(state.namePos.start, i).split(' ');
              state.mode = 'tag';
            }
          }
          break;
        case ' ':
          state.gapPos = i;
          if (isOpenTag() && current[current.length - 1].tag === '') {
            const tagName = htmlStr.slice(state.namePos.start, i);
            current[current.length - 1].tag = tagName;
            state.nodes.push(tagName);
            updateCurrent();
            state.namePos.end = i - 1;
          }
          break;
        case '=':
          if (
            isOpenTag() &&
            htmlStr.slice(state.gapPos + 1, i) === 'class' &&
            htmlStr[i + 1] === '"'
          ) {
            state.namePos.start = i + 2;
            state.mode = 'class';
          }
          break;
        case '/':
          if (isOpenTag()) {
            state.tagType = 'close';
          }
          break;
        default:
      }
    }
    return result;
  };
  return parseHTML(htmlStr);
};

export default parser;

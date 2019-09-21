const createNode = (tag = '', className = undefined, content = []) =>
  className == null
    ? {
        tag,
        content
      }
    : {
        tag,
        className,
        content
      };

const parse = htmlStr => {
  if (htmlStr === '' || typeof htmlStr !== 'string') {
    throw new Error('Argument is not a string or empty');
  }

  const result = { root: [] };
  const state = {
    path: 'root', // current level
    symbols: [], // stack for checking pairs inside tag
    nodes: [], // stack for checking tags pairs
    tag: { start: 0, end: 0, type: 'open' }, // tag name index
    className: { start: 0, end: 0 }, // class name index
    lastGapPos: 0,
    mode: '' // type of parsing (startTag/endTag/class/content)
  };
  for (let i = 0; i < htmlStr.length; i++) {
    let current = result;

    for (const i of state.path.split('.')) {
      current = current[i];
    }
    switch (htmlStr[i]) {
      case '<':
        if (state.symbols.length > 0) {
          throw new Error('Invalid tag');
        }
        state.tag.start = i + 1;

        if (state.mode === 'content' && i - state.tag.end > 3) {
          current.push(htmlStr.slice(state.tag.end + 2, i));
        }

        state.symbols.push('<');
        state.mode = 'tag';
        if (htmlStr[i + 1] !== '/') {
          state.tag.type = 'open';
          current.push(createNode());
        }
        break;
      case '>':
        if (
          state.symbols.length === 0 ||
          state.symbols[state.symbols.length - 1] !== '<'
        ) {
          throw new Error('Invalid tag');
        }
        if (state.tag.type === 'close') {
          const lastOpened = state.nodes.pop();
          const currentClosing = htmlStr.slice(state.tag.start + 1, i);
          if (lastOpened !== currentClosing) {
            throw new Error('Unclosed tag');
          }
          state.tag.type = 'open';
          state.path =
            state.path !== 'root'
              ? state.path.slice(0, state.path.lastIndexOf('.') - 2)
              : 'root';
        } else {
          state.path += `.${current.length - 1}.content`;
        }

        if (
          state.tag.type === 'open' &&
          state.mode === 'tag' &&
          state.tag.start > state.tag.end &&
          current[current.length - 1].tag === ''
        ) {
          current[current.length - 1].tag = htmlStr.slice(state.tag.start, i);
          state.nodes.push(htmlStr.slice(state.tag.start, i));
        }
        if (state.mode === 'tag') {
          state.tag.end = i - 1;
        }
        state.mode = 'content';
        state.symbols = [];
        break;
      case '"':
        if (
          state.mode !== 'content' &&
          state.symbols.length === 1 &&
          state.symbols[0] === '<'
        ) {
          state.symbols.push('"');
        } else if (
          state.mode !== 'content' &&
          state.symbols.length > 1 &&
          state.symbols[state.symbols.length - 1] === '"'
        ) {
          state.symbols.pop();
          if (state.mode === 'class') {
            state.className.end = i - 1;
            current[current.length - 1].class = htmlStr
              .slice(state.className.start, i)
              .split(' ');
            state.mode = 'tag';
          }
        }
        break;
      case ' ':
        state.lastGapPos = i;
        if (
          state.mode === 'tag' &&
          state.symbols[0] === '<' &&
          current[current.length - 1].tag === ''
        ) {
          current[current.length - 1].tag = htmlStr.slice(state.tag.start, i);
          state.nodes.push(htmlStr.slice(state.tag.start, i));
          state.tag.end = i - 1;
        }
        break;
      case '=':
        if (
          state.mode === 'tag' &&
          state.tag.type === 'open' &&
          state.symbols[0] === '<' &&
          state.tag.end > state.tag.start &&
          htmlStr.slice(state.lastGapPos + 1, i) === 'class' &&
          htmlStr[i + 1] === '"'
        ) {
          state.className.start = i + 2;
          state.mode = 'class';
        }
        break;
      case '/':
        if (state.mode === 'tag' && state.symbols[0] === '<') {
          state.tag.type = 'close';
        }
        break;
      default:
        console.log('nothing changed');
    }
    console.log(htmlStr[i], state, JSON.stringify(result));
  }
  return result;
};

const testData =
  '<html lang="ru" class="root root_1"><head><title>Document number one</title></head><body><div class="welcome"><div class="container"><div class="welcome__info"><div class="welcome__main"><span class="welcome__label">Hello! My 1st name is Batman</span><p>I am a junior front end developer with a passion for design. I loveCSS and cats. Great to meet you!</p></div><div class="welcome__footer"><a href="#0" class="welcome__link">Download resume</a><a href="#0" class="welcome__link">Write to me</a></div></div></div></div></body></html>';

parse(testData);

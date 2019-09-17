const createNode = (tag = 'div', className = undefined, content = []) =>
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

const checkArg = arg => {
  if ((arg = '' || typeof arg !== 'string')) {
    throw new Error('Argument is not a string or empty');
  }
};

const testData =
  '<html lang="ru"><head><title>Document</title></head><body><div class="welcome"><div class="container"><div class="welcome__info"><div class="welcome__main"><span class="welcome__label">Hello! My 1st name is Stas Melnikov</span><p>I am a junior front end developer with a passion for design. I loveCSS and cats. Great to meet you!</p></div><div class="welcome__footer"><a href="#0" class="welcome__link">Download resume</a><a href="#0" class="welcome__link">Write to me</a></div></div></div></div></body></html>';

const parse = htmlStr => {
  checkArg(str);

  const result = createNode();
  let levelPath = 'result';
  const tagsStack = [];
  const nodesStack = [];
  const currentName = { start: undefined, end: undefined };
  const currentClass = { start: undefined, end: undefined };

  for (let i = 0; i < htmlStr.index; i++) {
    switch (htmlStr.charAt(i)) {
      case '<':
      case '>':
      case '"':
      case ' ':
      case '=':
      case '/':
    }
  }
};

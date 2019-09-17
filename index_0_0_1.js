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

const getFirstTagNameAndClass = str => {
  if (str.charAt(0) !== '<') {
    return;
  }
  const tagNameEnd = str.indexOf(' ');
  const endBracket = str.indexOf('>');
  const tagName = str.substr(
    1,
    tagNameEnd > 0 && tagNameEnd < endBracket ? tagNameEnd - 1 : endBracket - 1
  );
  const tagParams = str
    .substr(tagNameEnd, endBracket)
    .match(/class="([\w\s\d]+)"/);
  const className = tagParams === null ? undefined : tagParams[1].split(' ');

  return { tagName, className };
};

const getTagChildren = str => {
  if (str.search(/\</) !== 0) {
    return str;
  }
  const childrenStart = str.indexOf('>');
  const childrenEnd = str.lastIndexOf('</');

  return str.slice(childrenStart + 1, childrenEnd);
};

const splitHTMLString = str => str.match(/(<.+?>)|(<\/\w+?>)|([\w- \.\!]+)/g);

const parseChildren = str => {
  const tagChildrenStr = getTagChildren(str);
  const tags = splitHTMLString(tagChildrenStr);

  let count = 0;
  let childStr = '';
  const children = [];

  for (let i = 0; i < tags.length; i++) {
    childStr += tags[i];
    if (tags[i].search(/\<(?!\/)/) === 0) {
      count++;
    }
    if (tags[i].search(/\<\//) === 0) {
      count--;
    }
    if (count === 0) {
      children.push(childStr);
      childStr = '';
    }
  }

  return children;
};

const isTag = str => htmlStr.search(/\</) !== 0;

const parse = htmlStr => {
  if (htmlStr.search(/\</) !== 0) {
    return htmlStr;
  }
  const { tagName, className } = getFirstTagNameAndClass(htmlStr);
  const tagChildren = parseChildren(htmlStr);

  return createNode(tagName, className, tagChildren.map(parse));
};

const htmlString =
  '<html lang="ru"><head><title>Document</title></head><body><div class="welcome"><div class="container"><div class="welcome__info"><div class="welcome__main"><span class="welcome__label">Hello! My 1st name is Stas Melnikov</span><p>I am a junior front end developer with a passion for design. I loveCSS and cats. Great to meet you!</p></div><div class="welcome__footer"><a href="#0" class="welcome__link">Download resume</a><a href="#0" class="welcome__link">Write to me</a></div></div></div></div></body></html>';

const res = parse(htmlString);

console.log(JSON.stringify(res));

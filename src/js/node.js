import { getElementsByClassName } from './helpers';
import * as Attr from './attr';

export const make = (tag = '', attrs = [], children = []) => ({
  tag,
  attrs,
  children,
});

export const addAttr = (node, attr) => {
  if (attr.name != null) {
    node.attrs.push(Attr.make(attr.name));
  }
  if (attr.value != null) {
    const length = node.attrs.length - 1;
    const { value } = node.attrs[length];
    value == null
      ? (node.attrs[length].value = attr.value)
      : (node.attrs[length].value += attr.value);
  }
};

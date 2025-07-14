import { DOM_TYPES, VTextNode, VFragNode, VElNode, VNode } from "./types";

// CREATE VIRTUAL NODES WITH HYPERSCRIPT

export const hText = (s: string): VTextNode => {
  return {
    type: DOM_TYPES.TEXT,
    value: s,
  };
};

export const hFrag = (children: VNode[]): VFragNode => {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: children,
  };
};

export const h = (tag: string, props: object, children: VNode[]): VElNode => {
  return {
    type: DOM_TYPES.ELEMENT,
    tag,
    props,
    children,
  };
};

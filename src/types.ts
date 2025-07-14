export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
};

export interface VTextNode {
  type: typeof DOM_TYPES.TEXT;
  value: string;
  el?: Text;
}

export interface VFragNode {
  type: typeof DOM_TYPES.FRAGMENT;
  children: VNode[];
  el?: DocumentFragment;
}

export interface VElNode {
  type: typeof DOM_TYPES.ELEMENT;
  tag: string;
  props: object;
  children: VNode[];
  el?: HTMLElement;
  listeners?: { [K in keyof HTMLElementEventMap]?: eventHandler[] };
}

export type VNode = VTextNode | VFragNode | VElNode | null;

export type eventHandler = (e: Event) => void;

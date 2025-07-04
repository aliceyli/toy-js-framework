const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
};

type SupportedNodes = HTMLElement | Text | DocumentFragment;

type DomTypes = (typeof DOM_TYPES)[keyof typeof DOM_TYPES];

type VNode = VTextNode | VFragNode | VElNode | null;

interface VTextNode {
  type: typeof DOM_TYPES.TEXT;
  value: string;
}

interface VFragNode {
  type: typeof DOM_TYPES.FRAGMENT;
  children: VNode[];
}

interface VElNode {
  type: typeof DOM_TYPES.ELEMENT;
  tag: string;
  props: object;
  children: VNode[];
}

// CREATE VIRTUAL DOM NODES

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

// TRANSFORM VIRTUAL DOM TO REAL ELEMENTS

export const mountDOM = (
  virtualDom: VNode,
  parentToAttachTo: SupportedNodes
) => {
  if (!virtualDom) {
    return;
  }

  let newNode: SupportedNodes;
  if (virtualDom.type === DOM_TYPES.ELEMENT) {
    const { tag, props, children } = virtualDom as VElNode;
    newNode = document.createElement(tag);
    // parse props

    for (let child of children) {
      mountDOM(child, newNode);
    }
  } else {
    newNode = document.createTextNode("some text"); // temp
  }
  parentToAttachTo.appendChild(newNode);
};

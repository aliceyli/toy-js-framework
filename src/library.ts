export const DOM_TYPES = {
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
  el?: Text;
}

interface VFragNode {
  type: typeof DOM_TYPES.FRAGMENT;
  children: VNode[];
  el?: DocumentFragment;
}

interface VElNode {
  type: typeof DOM_TYPES.ELEMENT;
  tag: string;
  props: object;
  children: VNode[];
  el?: HTMLElement;
  listeners?: { [K in keyof HTMLElementEventMap]?: ((e: Event) => void)[] };
}

type Props = Partial<
  {
    className: string;
    style: Partial<CSSStyleDeclaration>;
    on: { [K in keyof HTMLElementEventMap]?: (e: Event) => void };
  } & Record<string, any>
>;

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

const parseProps = (
  props: Props,
  node: HTMLElement,
  virtualDom: VElNode
): void => {
  const { on, class: className, style, ...otherAttr } = props;

  if (on) {
    Object.entries(on).forEach(([type, listener]) => {
      if (!virtualDom.listeners) {
        virtualDom.listeners = {};
      }
      node.addEventListener(type, listener);
      // add reference to listener back to virtual dom
      (virtualDom.listeners[type as keyof HTMLElementEventMap] ??= []).push(
        listener
      );
    });
  }

  if (className) {
    // Question: how should we handle className vs classList?
    // maybe if array, then use classlist, otherwise, use className?
    // in this case, we won't overwrite existing class names
    node.classList.add(className);
  }

  if (style) {
    for (let [name, value] of Object.entries(style)) {
      node.style.setProperty(name, value as string);
    }
  }

  for (let [name, value] of Object.entries(otherAttr)) {
    node.setAttribute(name, value);
  }
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

    // TODO: parse props
    parseProps(props, newNode, virtualDom as VElNode);

    virtualDom.el = newNode;
    parentToAttachTo.appendChild(newNode);

    for (let child of children) {
      mountDOM(child, newNode);
    }
  } else if (virtualDom.type === DOM_TYPES.FRAGMENT) {
    const { children } = virtualDom as VFragNode;

    // question: since we kinda want to ignore fragments, we don't need to createdocumentfragment() right?
    // newNode = document.createDocumentFragment();
    // virtualDom.el = newNode;
    // parentToAttachTo.appendChild(newNode);

    for (let child of children) {
      mountDOM(child, parentToAttachTo);
    }
  } else if (virtualDom.type === DOM_TYPES.TEXT) {
    const { value } = virtualDom as VTextNode;
    newNode = document.createTextNode(value);

    parentToAttachTo.appendChild(newNode);
  } else {
    return;
  }
};

export const DOM_TYPES = {
  TEXT: "text",
  ELEMENT: "element",
  FRAGMENT: "fragment",
};

type SupportedNodes = HTMLElement | Text | DocumentFragment;

type DomTypes = (typeof DOM_TYPES)[keyof typeof DOM_TYPES];

type VNode = VTextNode | VFragNode | VElNode | null;

type eventHandler = (e: Event) => void;

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

type Props = Partial<
  {
    className: string;
    style: Partial<CSSStyleDeclaration>;
    on: { [K in keyof HTMLElementEventMap]?: eventHandler };
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

// HELPERS
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

  const { type } = virtualDom;

  switch (type) {
    case DOM_TYPES.ELEMENT: {
      const { tag, props, children } = virtualDom as VElNode;
      const newNode = document.createElement(tag);

      parseProps(props, newNode, virtualDom as VElNode);

      virtualDom.el = newNode;
      parentToAttachTo.appendChild(newNode);

      for (let child of children) {
        mountDOM(child, newNode);
      }
      break;
    }
    case DOM_TYPES.FRAGMENT: {
      const { children } = virtualDom as VFragNode;

      virtualDom.el = parentToAttachTo;

      for (let child of children) {
        mountDOM(child, parentToAttachTo);
      }
      break;
    }
    case DOM_TYPES.TEXT: {
      const { value } = virtualDom as VTextNode;
      const newNode = document.createTextNode(value);

      virtualDom.el = newNode;
      parentToAttachTo.appendChild(newNode);
      break;
    }
    default: {
      throw new Error(`type ${type} is not valid`);
    }
  }
};

// Destroy DOM
export const destroyDOM = (virtualDom: VNode) => {
  if (!virtualDom) {
    return;
  }
  const { type } = virtualDom;

  switch (type) {
    case DOM_TYPES.ELEMENT: {
      const vElement = virtualDom as VElNode;

      if (vElement.el) {
        vElement.el.remove();
        delete vElement.el;
      }

      if (vElement.listeners) {
        Object.entries(vElement.listeners).forEach(([eventName, handlers]) =>
          handlers.forEach((handler) => removeEventListener(eventName, handler))
        );
        delete vElement.listeners;
      }

      vElement.children.forEach((child) => destroyDOM(child));
      break;
    }
    case DOM_TYPES.FRAGMENT: {
      const { children } = virtualDom as VFragNode;
      children.forEach((child) => destroyDOM(child));
      break;
    }
    case DOM_TYPES.TEXT: {
      const { el } = virtualDom as VTextNode;
      el?.remove();

      delete virtualDom.el;
      break;
    }
  }
};

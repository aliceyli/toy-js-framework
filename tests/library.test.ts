import {
  mountDOM,
  destroyDOM,
  DOM_TYPES,
  VFragNode,
  VTextNode,
  VElNode,
} from "../src/library.ts";

describe("mounting and destroying", () => {
  test("mounts and destroys text element", () => {
    const vNode: VTextNode = {
      type: DOM_TYPES.TEXT,
      value: "test",
    };

    const parent = document.createElement("div");

    mountDOM(vNode, parent);

    // element should be created
    expect(parent.childNodes.length).toBe(1);
    expect(parent.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
    expect(parent.childNodes[0].textContent).toBe("test");

    // virtual node has reference actual
    expect(vNode.el).toBe(parent.childNodes[0]);

    // destroys properly
    destroyDOM(vNode);
    expect(parent.childNodes.length).toBe(0);
  });

  test("mounts and destroys fragment", () => {
    const vNode: VFragNode = {
      type: DOM_TYPES.FRAGMENT,
      children: [
        { type: DOM_TYPES.TEXT, value: "test1" },
        { type: DOM_TYPES.TEXT, value: "test2" },
      ],
    };

    const parent = document.createElement("div");

    mountDOM(vNode, parent);

    // element should be created
    expect(parent.childNodes.length).toBe(2);
    expect(parent.childNodes[0].textContent).toBe("test1");
    expect(parent.childNodes[1].textContent).toBe("test2");

    // virtual node has reference to parent
    expect(vNode.el).toBe(parent);

    // destroys properly
    destroyDOM(vNode);
    expect(parent.childNodes.length).toBe(0);
  });

  test("mounts and destroys element", () => {
    const listener = jest.fn();
    const vNode: VElNode = {
      type: DOM_TYPES.ELEMENT,
      tag: "h1",
      props: {
        style: { color: "blue" },
        class: "test-heading",
        "aria-label": "test",
        "data-foo": "bar",
        unknown: "foo",
        on: { click: listener },
      },
      children: [{ type: DOM_TYPES.TEXT, value: "test" }],
    };

    const parent = document.createElement("div");

    mountDOM(vNode, parent);

    // element should be created
    expect(parent.childNodes.length).toBe(1);
    expect(parent.childNodes[0].nodeType).toBe(Node.ELEMENT_NODE);

    // element should get attributes
    const element = parent.childNodes[0] as HTMLElement;
    expect(element.style.color).toBe("blue");
    expect(element.textContent).toBe("test");
    expect(element.className).toBe("test-heading");
    expect(element.getAttribute("aria-label")).toBe("test");
    expect(element.dataset.foo).toBe("bar");
    expect(element.getAttribute("unknown")).toBe("foo");

    // element should have event listener attached
    element.click();
    expect(listener).toHaveBeenCalled();

    // virtual node should get reference to real element
    expect(vNode.el).toBe(parent.childNodes[0]);
    expect(vNode.listeners?.click).toEqual([listener]);

    // destroys properly
    destroyDOM(vNode);
    expect(parent.childNodes.length).toBe(0);
  });
});

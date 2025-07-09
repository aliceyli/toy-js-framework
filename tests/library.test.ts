import { mountDOM, DOM_TYPES } from "../src/library.ts";

describe("mounting", () => {
  test("mounts text element", () => {
    const textVNode = {
      type: DOM_TYPES.TEXT,
      value: "test",
    };

    const parent = document.createElement("div");

    mountDOM(textVNode, parent);

    expect(parent.childNodes.length).toBe(1);
    expect(parent.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
    expect(parent.childNodes[0].textContent).toBe("test");
  });

  test("mounts fragment", () => {
    const fragmentVNode = {
      type: DOM_TYPES.FRAGMENT,
      children: [
        { type: DOM_TYPES.TEXT, value: "test1" },
        { type: DOM_TYPES.TEXT, value: "test2" },
      ],
    };

    const parent = document.createElement("div");

    mountDOM(fragmentVNode, parent);

    expect(parent.childNodes.length).toBe(2);
    expect(parent.childNodes[0].textContent).toBe("test1");
    expect(parent.childNodes[1].textContent).toBe("test2");
  });

  test("mounts element", () => {
    const vNode = {
      type: DOM_TYPES.ELEMENT,
      tag: "h1",
      props: {
        style: { color: "blue" },
        class: "test-heading",
        "aria-label": "test",
        "data-foo": "bar",
        unknown: "foo",
      },
      children: [{ type: DOM_TYPES.TEXT, value: "test" }],
    };

    const parent = document.createElement("div");

    mountDOM(vNode, parent);

    expect(parent.childNodes.length).toBe(1);
    expect(parent.childNodes[0].nodeType).toBe(Node.ELEMENT_NODE);

    const element = parent.childNodes[0] as HTMLElement;
    expect(element.style.color).toBe("blue");
    expect(element.textContent).toBe("test");
    expect(element.className).toBe("test-heading");
    expect(element.getAttribute("aria-label")).toBe("test");
    expect(element.dataset.foo).toBe("bar");
    expect(element.getAttribute("unknown")).toBe("foo");
  });
});

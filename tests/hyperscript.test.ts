import { hText, hFrag, h } from "../src/hyperscript";
import { DOM_TYPES, VTextNode, VFragNode, VElNode, VNode } from "../src/types";

describe("Virtual DOM Node Creators", () => {
  describe("hText", () => {
    it("should create a VTextNode with correct type and value", () => {
      const result = hText("hello world");
      const expected: VTextNode = {
        type: DOM_TYPES.TEXT,
        value: "hello world",
      };
      expect(result).toEqual(expected);
    });
  });

  describe("hFrag", () => {
    it("should create a VFragNode with children", () => {
      const child = hText("nested");
      const result = hFrag([child]);
      const expected: VFragNode = {
        type: DOM_TYPES.FRAGMENT,
        children: [child],
      };
      expect(result).toEqual(expected);
    });

    it("should handle empty children array", () => {
      const result = hFrag([]);
      expect(result.type).toBe(DOM_TYPES.FRAGMENT);
      expect(result.children).toEqual([]);
    });
  });

  describe("h", () => {
    it("should create a VElNode with tag, props, and children", () => {
      const children: VNode[] = [hText("child text")];
      const props = { id: "main", className: "container" };
      const result = h("div", props, children);
      const expected: VElNode = {
        type: DOM_TYPES.ELEMENT,
        tag: "div",
        props,
        children,
      };
      expect(result).toEqual(expected);
    });

    it("should handle empty props and children", () => {
      const result = h("span", {}, []);
      expect(result.type).toBe(DOM_TYPES.ELEMENT);
      expect(result.tag).toBe("span");
      expect(result.props).toEqual({});
      expect(result.children).toEqual([]);
    });
  });
});

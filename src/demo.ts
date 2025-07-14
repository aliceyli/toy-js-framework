import { mountDOM } from "./dom.ts";
import { h, hText, hFrag } from "./hyperscript.ts";

const root = document.getElementById("app");

// let show = false;

const testVDom = hFrag([
  h("h1", {}, [hText("TO DO")]),
  h("ul", {}, [
    h("li", {}, [
      hText("implement mount dom"),
      h(
        "button",
        {
          class: "button1",
          style: { "background-color": "#04AA6D" },
          "data-test-id": "test",
          on: { click: () => alert("button1") },
        },
        [hText("button")]
      ),
    ]),
    h("li", {}, [
      hText("implement destroy dom"),
      h("button", {}, [hText("button")]),
    ]),
  ]),
]);

console.log("dom-before:", testVDom);

if (root) {
  mountDOM(testVDom, root);
  console.log("dom-after:", testVDom);
}

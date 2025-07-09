import { h, hText, mountDOM } from "./library.ts";

const root = document.getElementById("app");

// let show = false;

const testVDom = h("div", {}, [
  h("h1", {}, [hText("TO DO")]),
  h("ul", {}, [
    h("li", {}, [
      hText("implement mount dom"),
      //   show ? hText("this shouldn't show up") : null, // to do: what to do with this null case?
      h(
        "button",
        {
          className: "button1",
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

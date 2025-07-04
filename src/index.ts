import { h, hText, mountDOM } from "./library.ts";

// to test elements are generally showing up
let text: string = "Hello World";
const button = document.createElement("button");
button.innerHTML = text;
const textNode = document.createTextNode(text);
const root = document.getElementById("app");
root?.append(button);
root?.append(textNode);

// to test the toy library
let show = false;

const testVDom = h("div", {}, [
  h("p", {}, [
    hText("this is from the library"),
    show ? hText("this shouldn't show up") : null, // to do: what to do with this null case?
  ]),
]);

console.log(testVDom);

if (root) {
  mountDOM(testVDom, root);
}

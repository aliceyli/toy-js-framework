import { mountDOM } from "./dom";
import { h, hText, hFrag } from "./hyperscript";
import { createTodoApp } from "./demos/index-todo-sm";
import { createTicTacToeApp } from "./demos/index-ttt";

// Demo selector - change this to switch between demos
type DemoType = "static" | "todo" | "todo-sm" | "tictactoe";
const CURRENT_DEMO: DemoType = "static";

const root = document.getElementById("app");

function createStaticDemo() {
  const testVDom = hFrag([
    h("h1", {}, [hText("Static VDOM Demo")]),
    h("p", {}, [
      hText(
        "This is a static virtual DOM example showing hyperscript usage. Here's how to create a button and a list:"
      ),
    ]),
    h(
      "button",
      {
        class: "button1",
        style: { "background-color": "#04AA6D" },
        "data-test-id": "test",
        on: { click: () => alert("button clicked!") },
      },
      [hText("Test Button")]
    ),
    h("div", { style: { "margin-top": "20px" } }, [
      h("p", {}, [
        hText("Change CURRENT_DEMO in src/index.ts to switch demos:"),
      ]),
      h("ul", {}, [
        h("li", {}, [hText('"static" - This demo')]),
        h("li", {}, [hText('"todo" - Basic todo list')]),
        h("li", {}, [hText('"tictactoe" - Tic-tac-toe game')]),
      ]),
    ]),
  ]);

  if (root) {
    mountDOM(testVDom, root);
  }
}

function initDemo() {
  if (!root) {
    console.error("Could not find #app element");
    return;
  }

  // Clear the root first
  root.innerHTML = "";

  switch (CURRENT_DEMO) {
    case "static":
      createStaticDemo();
      break;
    case "todo":
      const todoApp = createTodoApp();
      todoApp.mount(root);
      break;
    case "tictactoe":
      const tttApp = createTicTacToeApp();
      tttApp.mount(root);
      break;
    default:
      console.error(`Unknown demo type: ${CURRENT_DEMO}`);
  }
}

// Initialize the demo
initDemo();

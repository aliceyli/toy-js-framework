// export { createApp } from "./app";
// export { h, hFrag, hText } from "./hyperscript";

import { createApp } from "./app";
import { view, ToDoState, addTodo } from "./app_demo";

const root = document.getElementById("app");
const todos = ["go to RC", "code", "get groceries"];
const state: ToDoState = {
  todos: todos,
};
const reducers = {
  addTodo: addTodo,
};

const app = createApp<ToDoState>({ state, view, reducers });

if (root) {
  app.mount(root);
}

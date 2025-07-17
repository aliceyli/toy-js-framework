import { h, hText, hFrag } from "./hyperscript";
import { VNode } from "./types";
import { State, Emit, ViewFn } from "./app";

export interface ToDoState extends State {
  todos: string[];
}

// reducer function
// Q: do i want to return a copy or the original array?
export const addTodo = (state: ToDoState, s: string) => {
  const { todos } = state;
  todos.push(s);
  return { todos };
};
export const removeTodo = (state: ToDoState, s: string) => {
  const { todos } = state;
  const idx = todos.findIndex((todo) => todo === s);
  return { todos: todos.splice(idx, 1) };
};

export const view: ViewFn<ToDoState> = (state, emit) => {
  const { todos } = state;

  const todoElements = todos.map((todo) =>
    h("li", { class: `${todo.replace(/ /g, "-")}` }, [
      hText(todo),
      h(
        "button",
        {
          on: {
            click: () => {
              emit("removeTodo", todo);
            },
          },
        },
        [hText("done")]
      ),
    ])
  );

  const header = h("h1", {}, [hText("TO DO")]);
  const addBar = h("div", {}, [
    h("label", { for: "newTodo" }, [hText("new TODO")]),
    h("input", { type: "text", id: "newTodo" }, []),
    h(
      "button",
      {
        type: "button",
        on: {
          click: () => {
            const newTodoInput =
              document.querySelector<HTMLInputElement>("#newTodo");
            if (!newTodoInput) {
              throw new Error("Couldn’t find #newTodo input");
            }
            const newTodo = newTodoInput.value.trim();
            if (newTodo) {
              emit("addTodo", newTodo);
            }
          },
        },
      },
      [hText("Add")]
    ),
  ]);
  const todoList = h("ul", { class: "todo-list" }, todoElements);

  return hFrag([header, addBar, todoList]);
};

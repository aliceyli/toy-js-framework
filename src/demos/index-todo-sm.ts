import { createApp } from "../app";
import { State, ViewFn } from "../app";
import { h, hFrag, hText } from "../hyperscript";
export interface TodoState extends State {
  todos: string[];
  text: string;
}

const state: TodoState = {
  todos: [],
  text: "",
};

const setText = (state: TodoState, payload: string): TodoState => {
  return {
    ...state,
    text: payload,
  };
};

const add = (state: TodoState, payload: string): TodoState => {
  return {
    todos: [...state.todos, payload], // add input text to todo list
    text: "", // clear input
  };
};

const reducers = {
  setText: setText,
  add: add,
};

export const view: ViewFn<TodoState> = (state, emit) => {
  const { todos, text } = state;

  const header = h("h1", {}, [hText("TO DO (State Machine)")]);

  const input = h(
    "input",
    {
      value: text,
      on: {
        input: (e: Event & { target: HTMLInputElement }) => {
          emit("setText", e.target?.value);
        },
      },
    },
    []
  );

  const button = h(
    "button",
    {
      on: {
        click: () => {
          emit("add", text);
        },
      },
    },
    [hText("Add")]
  );

  const todoList = h(
    "ul",
    {},
    todos.map((todo) => h("li", {}, [hText(todo)]))
  );

  return hFrag([header, input, button, todoList]);
};

export const createTodoApp = () => {
  return createApp<TodoState>({ state, view, reducers });
};

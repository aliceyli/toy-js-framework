import { Dispatcher, Payload } from "./dispatcher";
import { mountDOM, destroyDOM } from "./dom";
import { SupportedNodes, VNode } from "./types";

export interface State {
  [key: string]: unknown;
}
type Reducer<S, P = any> = (state: S, payload: P) => S;
type Reducers<S, P = any> = Record<string, Reducer<S, P>>;

interface AppMethods {
  mount: (arg0: SupportedNodes) => void;
  unmount: () => void;
}

export type Emit = (commandName: string, payload: any) => void;
export type ViewFn<S> = (state: S, emit: Emit) => VNode;

export interface AppOptions<S> {
  state: S;
  view: ViewFn<S>;
  reducers: Reducers<S, any>;
}

export function createApp<S>({
  state,
  view,
  reducers,
}: AppOptions<S>): AppMethods {
  let parentEl: SupportedNodes | null = null;
  let vdom: VNode = null;

  const dispatcher = new Dispatcher();
  let unsubscribers = [dispatcher.addAfterHandler(renderApp)];

  Object.entries(reducers).forEach(([command, reducer]) => {
    const unsub = dispatcher.subscribe(command, (payload) => {
      reducer(state, payload);
    });
    unsubscribers.push(unsub);
  });

  function emit(commandName: string, payload: any) {
    dispatcher.dispatch(commandName, payload);
  }

  function renderApp() {
    if (vdom) {
      destroyDOM(vdom);
    }
    vdom = view(state, emit);
    if (parentEl) {
      mountDOM(vdom, parentEl);
    }
  }

  return {
    mount(parent: SupportedNodes) {
      parentEl = parent;
      renderApp();
    },
    unmount() {
      if (vdom) {
        destroyDOM(vdom);
      }
      vdom = null;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    },
  };
}

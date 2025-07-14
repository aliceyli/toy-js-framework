type CommandName = string;
type Payload = any;
type Handler = (arg0: Payload) => void;
type AfterHandler = () => any;
type Subscriptions = Map<CommandName, Handler[]>;
type Unsubscribe = () => void;

export class Dispatcher {
  private subs: Subscriptions = new Map();
  private afterHandlers: AfterHandler[] = []; // may need to update this type when we get more info on what these could be

  subscribe(commandName: CommandName, handler: Handler): Unsubscribe {
    const { subs } = this;

    let subList = subs.get(commandName);

    if (!subList) {
      let handlers: Handler[] = [];
      subs.set(commandName, handlers);
      subList = handlers;
    }

    if (!subList.find((h) => h === handler)) {
      subList.push(handler);
    }

    return () => {
      const idx = subList?.findIndex((h) => h === handler);
      if (idx >= 0) {
        subList.splice(idx, 1);
      }
    };
  }

  dispatch(commandName: CommandName, payload: Payload): void {
    const { subs, afterHandlers } = this;
    const handlers = subs.get(commandName);

    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    } else {
      throw new Error(`No handler registered for command "${commandName}"`);
    }

    afterHandlers.forEach((handler) => handler());
  }

  addAfterHandler(handler: AfterHandler): Unsubscribe {
    const { afterHandlers } = this;

    afterHandlers.push(handler);

    return () => {
      const idx = afterHandlers.findIndex((h) => h === handler);
      if (idx >= 0) {
        afterHandlers.splice(idx, 1);
      }
    };
  }
}

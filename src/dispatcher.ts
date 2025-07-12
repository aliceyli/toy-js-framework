type CommandName = string;
type Payload = any;
type Handler = (arg0: Payload) => void;
type Subscriptions = Map<CommandName, Handler[]>;

export class Dispatcher {
  private subs: Subscriptions = new Map();
  private afterHandlers: Handler[] = [];

  subscribe(commandName: CommandName, handler: Handler) {
    const { subs } = this;

    let subList = subs.get(commandName);

    if (!subList) {
      let handlers: Handler[] = [];
      subs.set(commandName, handlers);
      subList = handlers;
    }

    if (!subList.find(handler)) {
      subList.push(handler);
    }

    return () => {
      const idx = subList?.indexOf(handler);
      if (idx >= 0) {
        subList.splice(idx, 1);
      }
    };
  }

  dispatch(commandName: CommandName, payload: Payload) {
    //todo
  }

  addAfterHandler(handler) {
    //todo
  }
}

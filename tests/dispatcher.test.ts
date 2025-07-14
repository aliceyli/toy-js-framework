import { Dispatcher } from "../src/dispatcher";

type Payload = { foo?: string };

describe("Dispatcher", () => {
  let dispatcher: Dispatcher;

  beforeEach(() => {
    dispatcher = new Dispatcher();
  });

  it("calls every handler subscribed to a command with the payload", () => {
    const h1 = jest.fn();
    const h2 = jest.fn();

    dispatcher.subscribe("doSomething", h1);
    dispatcher.subscribe("doSomething", h2);

    const payload: Payload = { foo: "bar" };
    dispatcher.dispatch("doSomething", payload);

    expect(h1).toHaveBeenCalledWith(payload);
    expect(h2).toHaveBeenCalledWith(payload);
  });

  it("throws if you dispatch an un-registered command", () => {
    expect(() => dispatcher.dispatch("nope", 123)).toThrow(
      `No handler registered for command "nope"`
    );
  });

  it("unsubscribe function returned by subscribe actually removes the handler", () => {
    const h = jest.fn();
    const unsubscribe = dispatcher.subscribe("cmd", h);

    dispatcher.dispatch("cmd", null);
    expect(h).toHaveBeenCalledTimes(1);

    unsubscribe();
    dispatcher.dispatch("cmd", null);
    expect(h).toHaveBeenCalledTimes(1); // doesn't call again after removed
  });

  it("does not register the same handler more than once", () => {
    const h = jest.fn();
    dispatcher.subscribe("dup", h);
    dispatcher.subscribe("dup", h); // second call should be ignored

    dispatcher.dispatch("dup", 42);
    expect(h).toHaveBeenCalledTimes(1);
  });

  describe("afterHandlers", () => {
    it("runs all after–handlers _after_ command handlers", () => {
      const order: string[] = [];
      const h = () => order.push("cmd");
      const after = () => order.push("after");

      dispatcher.subscribe("x", h);
      dispatcher.addAfterHandler(after);

      dispatcher.dispatch("x", null);

      expect(order).toEqual(["cmd", "after"]);
    });

    it("unsubscribe function returned by addAfterHandler actually removes the after–handler", () => {
      const after = jest.fn();
      const removeAfter = dispatcher.addAfterHandler(after);

      dispatcher.subscribe("y", () => {
        /*no-op*/
      });
      dispatcher.dispatch("y", 0);
      expect(after).toHaveBeenCalledTimes(1);

      removeAfter();
      dispatcher.dispatch("y", 0);
      expect(after).toHaveBeenCalledTimes(1); // doesn't call again after removed
    });
  });
});

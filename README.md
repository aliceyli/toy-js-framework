# Toy.ts Framework

A lightweight virtual DOM framework with state management, built from scratch in TypeScript. This educational project demonstrates the core concepts behind modern JavaScript frameworks like React and Vue.

It follows concepts from Ángel Sola Orbaiceta's book, [Build a Frontend Web Framework (From Scratch)](https://www.manning.com/books/build-a-frontend-web-framework-from-scratch), while adding type safety, testing and additional demos.

This framework covers:

- How virtual DOM systems work
- State management patterns
- Event handling and cleanup
- TypeScript in framework design

Future work:

- A reconcilliation (or diffing) algorithm to increase efficiency of updating the DOM
- Component-level state management

Feel free to explore the code and experiment with the demos!

## Features

- 🌳 **Virtual DOM** - Efficient DOM manipulation with three node types (ELEMENT, TEXT, FRAGMENT)
- 🎯 **Hyperscript API** - Declarative UI creation with `h()`, `hText()`, and `hFrag()`
- 🔄 **State Management** - Flux-style architecture with reducers and dispatcher
- 🎮 **Event Handling** - Built-in event listener management with automatic cleanup
- 📦 **TypeScript** - Full type safety throughout the framework
- 🧪 **Testing** - Jest test suite with jsdom environment

## Quick Start

```bash
# Install dependencies
npm install

# Build and start development server
npm start

# Or run commands separately:
npm run build    # Build the project
npm run dev      # Start development server on http://localhost:8080

# Run tests
npm test
```

## Demos

The framework includes several interactive demos. To switch between them:

1. Open `src/index.ts`
2. Change the `CURRENT_DEMO` variable:
   - `"static"` - Static VDOM example with hyperscript
   - `"todo"` - Basic todo list application
   - `"tictactoe"` - Interactive tic-tac-toe game
3. Run `npm start`
4. Open http://localhost:8080 in your browser

## Basic Usage

### Creating Elements with Hyperscript

```typescript
import { h, hText, hFrag } from "./hyperscript";

// Create elements
const button = h(
  "button",
  {
    class: "btn",
    style: { color: "blue" },
    on: { click: () => alert("Clicked!") },
  },
  [hText("Click me")]
);

// Create fragments
const ui = hFrag([h("h1", {}, [hText("Hello World")]), button]);
```

### Building Applications with State

```typescript
import { createApp } from "./app";

interface AppState {
  count: number;
}

const state = { count: 0 };

const reducers = {
  increment: (state: AppState) => ({ count: state.count + 1 }),
  decrement: (state: AppState) => ({ count: state.count - 1 }),
};

const view = (state: AppState, emit) => {
  return hFrag([
    h("div", {}, [hText(`Count: ${state.count}`)]),
    h("button", { on: { click: () => emit("increment") } }, [hText("+")]),
    h("button", { on: { click: () => emit("decrement") } }, [hText("-")]),
  ]);
};

const app = createApp({ state, view, reducers });
app.mount(document.getElementById("app"));
```

## Architecture

### Virtual DOM System

- **Types** (`src/types.ts`) - Core interfaces for VNode types
- **Hyperscript** (`src/hyperscript.ts`) - Element creation functions
- **DOM** (`src/dom.ts`) - Mounting and unmounting logic

### State Management

- **App** (`src/app.ts`) - Application framework with createApp()
- **Dispatcher** (`src/dispatcher.ts`) - Event dispatcher for state updates
- **Diff** (`src/diff.ts`) - Object diffing utilities

### Core Concepts

**Immutable State Updates**

```typescript
// Reducers return new state objects
const reducer = (state, payload) => ({ ...state, newValue: payload });
```

**Event-Driven Updates**

```typescript
// Emit events to trigger state changes
emit("actionName", payload);
```

**Automatic Re-rendering**

```typescript
// Framework handles re-rendering when state changes
// View functions are pure - same state = same output
```

## API Reference

### Hyperscript Functions

- `h(tag, props, children)` - Create element nodes
- `hText(string)` - Create text nodes
- `hFrag(children)` - Create document fragments

### Props Object

- `class: string` - CSS class name
- `style: object` - Inline styles as key-value pairs
- `on: object` - Event handlers (`{ click: handler }`)
- `...attributes` - Any other HTML attributes

### App Creation

- `createApp({ state, view, reducers })` - Create application instance
- `app.mount(element)` - Mount to DOM element
- `app.unmount()` - Clean up and unmount

## File Structure

```
src/
├── index.ts              # Demo switcher
├── app.ts               # Application framework
├── dispatcher.ts        # Event dispatcher
├── dom.ts              # DOM operations
├── hyperscript.ts      # Element creation
├── types.ts            # TypeScript definitions
├── diff.ts             # Diffing utilities
└── demos/              # Example applications
    ├── index-todo.ts       # Basic todo list
    ├── index-todo-sm.ts    # State machine todo
    └── index-ttt.ts        # Tic-tac-toe game
```

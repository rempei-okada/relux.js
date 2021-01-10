# Relux.js

English / [日本語](https://github.com/rempei-okada/relux.js/blob/main/.github/README.ja.md)

[![npm version](https://badge.fury.io/js/relux.js.svg)](https://badge.fury.io/js/relux.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Flexible and easy state management container for React or other JavaScript apps designed with TypeScript-First. 

Relux.js provides you to Simply manage unidirectional data flows with class-based Object-Orientation-Programming and Dependency Injection.

[DEMO](https://rempei-okada.github.io/relux.js/)

[NPM](https://www.npmjs.com/package/relux.js)

[Documents on Github](https://github.com/rempei-okada/relux.js)

# Background to development

I felt that the existing React state management library wouldn't scale for me.

Redux, Recoil and MobX are popular for React state management. The otherwise there are numerous state management libraries. middlewares are also crowded, so which one should I choose ...

Redux has achieved robust data flow with great Functional-Programming.
By using Redux-Toolkit, you can eliminate annoying boilerplates, and keep plates and Type-Safe.
However, I thought Redux didn't go very well with the Domain-Driven-Design, Onion or Clean architecture and dependency-injection that has been done in Object-Oriented-Programming. And so is Recoil too.

How about MobX? MobX realize Object-Oriented-Programming approach and easy to implement and very simple to write.
But, It does not necessarily require unidirectional data flow. That means you can easily break it even if you set rules.

I think Vue's Vuex and Elm architectures are very simple and excellent.
I wanted a state management library that could easily be integrated with Object-Oriented-Programming with those characteristics and Type-Safe.

Therefore, referring to Vuex and Elm architecture, we devise Relux.js to fill the gap between Redux and MobX.

Functional-Programming is great, but sometimes Relux.js can be useful when you want to blend in with Object-Oriented-Programming.

# Rules
![](./relux.png)

* State should always be read-only.
* To change state our app should dispatch an action.
* Every mutation that processes the dispatched action  will create new state to reflect the old state combined with the changes expected for the action.
* The UI then uses the new state to render its display.

# Installation

```
yarn add relux.js react-relux
```

or

```
npm install --save relux.js react-relux
```

# Usage

As a example, implement counters and Fibonacci counters in various patterns.
Each feature can be sliced. A combination of multiple actions and one state is called a slice.

All examples are written in TypeScript, but JavaScript can also be used.

## Create Initial State

Create two slices of ```counter``` and ```Fib```.
Actions can only update the state of the slice to which they belong.

### Define state type.

As a class instance.

```ts
import { State } from "relux.js";

/**
 * State for counter.
 */
export class CounterState extends State<CounterState> {
    count = 0;

    get next() {
        return this.count + 1;
    }
}
```

As a plane object.

```ts
/**
 * State for fibonacci.
 */
export interface FibState {
    n: number;
    count: number;
}
```

## Create a store instance.

Please register the slice. Also, for services, specify the service described below for which you want to inject dependencies.

```ts
import { createStore } from "relux.js";

export const store = createStore({
    slices: {
        counter: {
            name: "counter",
            actions: [
                AsyncIncrementCountAction
            ],
            // class instance
            state: new CounterState()
        },
        fib: {
            name: "fib",
            actions: [
                IncrementalFibonacciAction,
            ],
            // plane object
            state: {
                n: 0,
                count: 0
            }
        }
    },
    // Register services that resolves in actions
    services: [
        FibonacciService
    ]
});

// Export RootState Type
export type RootState = ReturnType<typeof store.getState>;
```

## Create Actions

To create an action, you need to extends ```Action<TState,  Tpayload>``` class. The class name is the action name. For TState, specify the type of the state, and for TPayload, specify the type of the argument received by the invoke method.
When you dispatch an Action, the invoke method is called.

class name is used as the action name, but when minify and compressing the class name with Bandler, it can be overridden by declaring the ```name``` property.

```ts
class HogeState extends State<HogeState> {
    hoge = 12345678;
}

interface HogePayload { hoge: number; }

class HogeAction extends Action<HogeState, HogePayload> {
    readonly name = "OverriddenHogeActionName";

    invoke(payload: HogePayload): Feature<HogeState> {
        return ({ mutate }) => {
            mutate(s => s.clone({ hoge: payload.hoge }));
        };
    }
}

store.dispatch(HogeAction, { hoge: 123456 });
```

### This is an example action for counter.

```ts
import { Action, Feature } from "relux.js";

/**
 * Increment counter with delay.
 */
export class AsyncIncrementCountAction extends Action<CounterState, number>  {
    public invoke(timeout: number): Feature<CounterState> {
        return async ({ mutate, state }) => {
            await new Promise(resolve => setTimeout(resolve, timeout));
            mutate(s => s.clone({
                count: s.count + 1
            }))
        };
    }
}
```

## Dispatch an action and change states

States will change after 1000ms.

```ts
store.dispatch(AsyncIncrementCountAction, 1000);
```

## Subscribe on states changed

Called 1000ms after dispatching.

```ts
store.subscribe(e => {
    console.log(`Counter: ${e.state.count}`);
    console.log(`Slice Name: ${e.sliceName}`);
});
```

## Dispatch another action in an action

```ts
import { Action, Feature } from "relux.js";

/**
 * Increment counter with delay.
 */
export class AsyncIncrementCountAction extends Action<CounterState, number>  {
    public invoke(timeout: number): Feature<CounterState> {
        return async ({ mutate, state }) => {
            await new Promise(resolve => setTimeout(resolve, timeout));
            mutate(s => s.clone({
                count: s.count + 1
            }));

            // Dispatch another slice action
            dispatch(AsyncIncrementCountAction, 1000);
        };
    }
}
```

## With React

An Example for React. Update state and render with Hooks.

```tsx
import { Provider, useStore, useObserver } from "react-relux";

export default () => {
    return (
        <Provider store={store}>
            <div style={{ padding: "20px" }}>
                <Counter />
                <FibCounter />
            </div>
        </Provider>
    );
};

function Counter() {
    const store = useStore();
    const counter = useObserver((s: RootState) => s.counter);
    const next = useObserver((s: RootState) => s.counter.next);

    function increment() {
        store.dispatch(AsyncIncrementCountAction, 1000)
    }

    return (
        <div>
            <h1>Counter</h1>
            <button onClick={increment}>Count</button>
            <p>Counter will increment after 1000ms</p><br />
            <div>Count: {counter.count}</div>
            <div>Next: {next}</div>
            <br />
        </div>
    );
}

function FibCounter() {
    const dispatch = useDispatch();
    const counter = useObserver((s: RootState) => s.fib);

    function increment() {
        dispatch(IncrementalFibonacciAction, undefined)
    }

    return (
        <div>
            <h1>Fibonacci counter</h1>
            <button onClick={increment}>Compute</button>
            <p>Compute Fibonacci number when N {"<"} 40</p>
            <p>Counter will increment after 1000ms</p><br />
            <div>Fib: {counter.count}</div>
            <div>N: {counter.n}</div>
        </div>
    );
}
```

## Dependency Injection

Services implemented as side effects such as HTTP Requests, asynchronous, DB access, and algorithm implementation can be accessed from actions using dependency injection.

### Create a service and register

Create a service that generate fibonacci number.

```ts
class FibonacciService {
    public fib(n: number) {
        if (n < 3) return 1;
        return this.fib(n - 1) + this.fib(n - 2);
    }
}
```

You must register a Service to ```option.services``` when creating a store instance.

```ts
const store = createStore({
 slices: { ... },
 services: [
     FibonacciService
 ]
});
```

### Resolve without Decorator

If you define a static property ```parameters``` that return definition array to inject a dependency, the service will be automatically assigned to constructor arguments when you dispatch the action. Services can also be nested. 
parameters must match the constructor arguments exactly.

```ts
/**
 * Increament fibonacci counter action.
 */
export class IncrementalFibonacciAction extends Action<FibState, undefined> {
    static parameters = [FibonacciService];

    // Assign a service automatically.
    constructor(private readonly fibService: FibonacciService) { 
        super();
    }

    public invoke(_: undefined): Feature<FibState> {
        return ({ dispatch, mutate, state }) => {
            if (state.n < 40 === false) {
                return;
            }

            const fib = this.fibService.fib(state.n + 1);

            // update state
            mutate(s => ({
                ...s,
                count: fib,
                n: s.n + 1
            }));

            // Dispatch another slice action
            dispatch(AsyncIncrementCountAction, 1000);
        };
    }
}
```

### Resolve with Decorator

#### Setup

Also for TypeScript you will need to enable ```experimentalDecorators``` and ```emitDecoratorMetadata``` flags within your tsconfig.json

If you want to build on bable (Gatsby, Create React App, etc.), you'd need the following Babel plugin.
add the babel package plugin-proposal-decorators.

```
yarn add -D @babel/plugin-proposal-decorators babel-plugin-transform-typescript-metadata
```
or
```
npm install -D @babel/plugin-proposal-decorators babel-plugin-transform-typescript-metadata
```

Add the following configuration to your ```.babelrc``` or ```babel.config.js``` file ```plugins``` section.

```
["@babel/plugin-proposal-decorators", { "legacy": true }],
["babel-plugin-transform-typescript-metadata"]
```

Give your class ```@Injectable``` decorator.
After that, just specify the type in the constructor argument and it will be assigned automatically without doing anything special.

```ts
import { Injectable } from "relux.js";

/**
 * Increament fibonacci counter action.
 */
@Injectable()
export class IncrementalFibonacciAction extends Action<FibState, undefined> {
    constructor(private readonly fibService: FibonacciService) { 
        super();
    }

    public invoke(_: undefined): Feature<FibState> {
        return ({ dispatch, mutate, state }) => {
            if (state.n < 40 === false) {
                return;
            }

            const fib = this.fibService.fib(state.n + 1);

            // update state
            mutate(s => ({
                ...s,
                count: fib,
                n: s.n + 1
            }));

            // Dispatch another slice action
            dispatch(AsyncIncrementCountAction, 1000);
        };
    }
}
```

# License
Designed with ♥ Renpei Okada. Licensed under the MIT License.

# Have a nice development life ♥
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

# Counter Example

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

## Change state

To change the state, Dispatch Action by message and you need to Mutate via Mutation in it.
Mutation should only contain logic to generate new state from old state or message type. Therefore, Mutation must be a pure function. This makes it easier to keep track of state changes and to perform time travel.

It is not recommended to deal with side effects in Mutation. Therefore, data processing using asynchronous, side effects, etc. should be done in Action.

In the following example, the Decorator is used to bind the Actoin and Message to be Dispach.


```ts
import { Store, State, Message, action, store } from "relux.js";

// Mutaion messages for mutation
class CountUp extends Message { }
class BeginLoading extends Message { }
class EndLoading extends Message { }

// Action messages for dispatch action
export class CountUpWithTimer extends Message {
    constructor(readonly timeout: number) { super(); }
}

// specify store name
@store({ name: "CounterStore" })
export class CounterStore extends Store<CounterState> {
    constructor() {
        super(new CounterState(), CounterStore.mutation);
    }

    private static mutation(state: CounterState, message: Message): CounterState {
        switch (true) {
            case message instanceof BeginLoading:
                return state.clone({
                    isLoading: true
                });
            case message instanceof EndLoading:
                return state.clone({
                    isLoading: false
                });
            case message instanceof CountUp:
                const payload = message as CountUp;
                return state.clone({
                    count: state.count + 1
                });
            default:
                return state;
        }
    }

    @action(CountUpWithTimer)
    protected async countUpWithTimer(message: CountUpWithTimer): Promise<void> {
        this.mutate(new BeginLoading);

        await this.delay(message.timeout);

        this.mutate(new CountUp);
        this.mutate(new EndLoading);
    }

    private async delay(timeout: number) {
        await new Promise(resolve => setTimeout(resolve, timeout));
    }
}
```

In an environment that Decorator is not available, you can also the following

```ts
export class CounterStore extends Store<CounterState> {
    // store name
    static slice = "CounterStore";

    constructor() {
        super(new CounterState(), CounterStore.mutation);

        // bind message to action
        this.bindAction(CountUpWithTimer, this.countUpWithTimer);
    }

    private static mutation(state: CounterState, message: Message): CounterState {
        ...
    }

    protected async countUpWithTimer(message: CountUpWithTimer): Promise<void> {
        ...
    }
}
```

## Create a store instance.

Please register the slice. Also, for services, specify the service described below for which you want to inject dependencies.

```ts
import { createProvider } from "relux.js";

export const provider = createProvider({
    stores: [CounterStore, FibStore],
    services: [
        FibonacciService
    ]
});
```


## Dispatch an action and change states

States will change after 1000ms.

```ts
provider.dispatch(new CountUpWithTimer(100));
```

## Subscribe on states changed

Called 1000ms after dispatching.

```ts
provider.subscribe(e => {
    console.log(`Counter: ${e.state.count}`);
    console.log(`Slice Name: ${e.sliceName}`);
});
```

## Dispatch another action in an action

```ts
import { Store, State, Message, action, store } from "relux.js";

// Mutaion messages for mutation
class HogeMessage extends Message { }

@store({ name: "HogeStore" })
class HogeStore {
    constructor(readonly counter: CounterStore) {
        super(..., ...);
    }

    @action(HogeMessage)
    hogeCounter(_: HogeMessage){
        this.mutate(...);
        // Dispatch CounterStore action
        await this.counter.dispatch(new CountUpWithTimer(1000));
        this.mutate(...);
        this.mutate(...);
    }
}
```


## Dependency Injection

Services implemented as side effects such as HTTP Requests, asynchronous, DB access, and algorithm implementation can be accessed from actions using dependency injection.

### Create a service and register

Create a service that generate fibonacci number.

```ts
import { Store, service, store, action, Message } from "relux.js";

const fibState = {
    n: 0,
    count: 0,
    history: [] as number[]
}

type FibState = typeof fibState;

@service()
export class FibonacciService {
    public fib(n: number): number {
        if (n < 3) return 1;
        return this.fib(n - 1) + this.fib(n - 2);
    }
}

class SetFib extends Message {
    constructor(readonly fib: number) { super(); }
}
export class CalcFib extends Message { }

/**
 * Increament fibonacci counter action.
 */
@store({ name: "fib" })
export class FibStore extends Store<FibState> {
    constructor(readonly fibService: FibonacciService) {
        super(fibState, FibStore.update);
    }

    static update(state: FibState, message: Message): FibState {
        switch (true) {
            case message instanceof SetFib:
                const payload = message as SetFib;
                return {
                    ...state,
                    n: state.n + 1,
                    count: payload.fib,
                    history: [...state.history, payload.fib]
                }
            default: return state;
        }
    }

    @action(CalcFib)
    calc(_: CalcFib) {
        if (this.state.n < 40 === false) {
            return;
        }

        const fib = this.fibService.fib(this.state.n);
        this.mutate(new SetFib(fib));
    }
}
```

You must register a Service to ```option.services``` when creating a store instance.

```ts
const provider = createProvider({
 slices: { ... },
 services: [
     FibonacciService
 ]
});
```

### Resolve with Decorator

Give your class ```@service``` decorator.
After that, just specify the type in the constructor argument and it will be assigned automatically without doing anything special.

```ts
import { service } from "relux.js";

@service()
class FooService {
  async invoke() {
      return ...;
  }
}

class HogeService {
    constructor(readonly fooService: FooService){}

    async call() {
        return await this.fooService.invoke();
    }
}

class TestMessage extends Message {}
class SetTest extends Message {
    constructor(readonly test: string) {}
}

@store({ name: "TestStore"})
class TestStore extends Store<...> {
    constructor(readonly hogeService: HogeService) {}

    @action(TestMessage)
    async invoke(_: TestMessage) {
        const result = await this.hogeService.call();
        this.mutate(new SetTest(result));
    }
}
```

### Resolve without Decorator

If you define a static property ```parameters``` that return definition array to inject a dependency, the service will be automatically assigned to constructor arguments when you dispatch the action. Services can also be nested. 
parameters must match the constructor arguments exactly.

```ts
import { service } from "relux.js";

class FooService {
  async invoke() {
      return ...;
  }
}

class HogeService {
    static parameters = [FooService];
    constructor(readonly fooService: FooService){}

    async call() {
        return await this.fooService.invoke();
    }
}

class TestMessage extends Message {}
class SetTest extends Message {
    constructor(readonly test: string) {}
}

class TestStore extends Store<...> {
    static parameters = [HogeService];

    constructor(readonly hogeService: HogeService) {
        this.bindAction(TestMessage, this.invoke);
    }

    async invoke(_: TestMessage) {
        const result = await this.hogeService.call();
        this.mutate(new SetTest(result));
    }
}
```

# With React

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
    const provider = useProvider();
    const counter = useObserver(CounterStore);
    const next = useObserver(CounterStore, s => s.next);

    function increment() {
        provider.dispatch(new CountUpWithTimer(1000))
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
    const counter = useObserver(FibStore);

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

#### Use Decorator Setup with React

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

# License
Designed with ♥ Rempei Okada. Licensed under the MIT License.

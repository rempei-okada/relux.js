import { createStore, Store } from "relux.js";
import { AsyncIncrementCountAction, CounterService, CounterState } from "./Counter";
import { IncrementalFibonacciAction } from "./fibonacci";

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
    services: [
        CounterService
    ]
});

export type RootState = ReturnType<typeof store.getState>;

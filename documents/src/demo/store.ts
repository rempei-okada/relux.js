import "reflect-metadata";
import { createStore, Store } from "relux.js";
import { constructor } from "tsyringe/dist/typings/types";
import { AsyncIncrementCountAction, CounterState } from "./counter";
import { FibonacciService, IncrementalFibonacciAction } from "./fibonacci";

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
                count: 0,
                history: []
            }
        }
    },
    services: [
        FibonacciService
    ]
});

export type RootState = ReturnType<typeof store.getState>;
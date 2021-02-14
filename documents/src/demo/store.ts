import "reflect-metadata";
import { createProvider } from "relux.js";
import { CounterState, CounterStore } from "./counter";
import { FibonacciService, FibStore } from "./fibonacci";

export const provider = createProvider({
    stores: [CounterStore, FibStore],
    services: [
        FibonacciService
    ]
});
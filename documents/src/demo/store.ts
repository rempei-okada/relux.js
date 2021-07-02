import "reflect-metadata";
import { createProvider, defineStore, defineMessage } from "relux.js";
import { CounterState, CounterStore } from "./counter";
import { FibonacciService, FibStore } from "./fibonacci";

const [countUp, isCountUp, getPayload] = defineMessage<number>("countUp");

export const HogeStore = defineStore({
    actions: ({ mutate, getState }) => {
        return {
            countUp: async () => {
                const s = getState();
                mutate(countUp(s.hoge + 1));
            }
        }
    },
    mutation: (s, m) => {
        switch (true) {
            case isCountUp(m): {
                const payload = getPayload(m);
                return {
                    ...s,
                    hoge: payload
                }
            }
        }
        return s;
    },
    initialState: () => ({ hoge: 0 }),
    name: "HogeStore"
});


export const provider = createProvider({
    stores: [CounterStore, FibStore, HogeStore],
    services: [
        FibonacciService
    ]
});
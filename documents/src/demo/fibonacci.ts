import { Action, Feature, Injectable, Inject } from "relux.js";
import { AsyncIncrementCountAction } from "./counter";

export interface FibState {
    n: number;
    count: number;
    history: number[];
}

export class FibonacciService {
    public fib(n: number): number {
        if (n < 3) return 1;
        return this.fib(n - 1) + this.fib(n - 2);
    }
}

/**
 * Increament fibonacci counter action.
 */
export class IncrementalFibonacciAction extends Action<FibState, undefined> {
    static readonly parameters = [FibonacciService];
    readonly name = "IncrementalFibonacciAction";

    constructor(readonly fibService: FibonacciService) {
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
                n: s.n + 1,
                history: [...s.history, fib]
            }));

            // Dispatch another slice action
            dispatch(AsyncIncrementCountAction, 1000);
        };
    }
}
import { Action, Feature } from "relux.js";
import { AsyncIncrementCountAction } from "./Counter";

export interface FibState {
    n: number;
    count: number;
}

/**
 * Increament fibonacci counter action.
 */
export class IncrementalFibonacciAction extends Action<FibState, undefined> {
    public invoke(_: undefined): Feature<FibState> {
        return ({ dispatch, mutate, state }) => {
            if (state.n < 40 === false) {
                return;
            }

            // update state
            mutate(s => ({
                ...s,
                count: this.fib(s.n + 1),
                n: s.n + 1
            }));

            // Dispatch another slice action
            dispatch(AsyncIncrementCountAction, 1000);
        };
    }

    private fib(n: number) {
        if (n < 3) return 1;
        return this.fib(n - 1) + this.fib(n - 2);
    }
}
import { Action, State, Feature } from "relux.js";

/**
 * State for counter.
 */
export class CounterState extends State<CounterState> {
    count = 0;

    get next() {
        return this.count + 1;
    }
}

/**
 * Counter service.
 */
export class CounterService {
    contUp(current: number, num: number): number {
        return current + num;
    }
}

/**
 * Increment counter with delay.
 */
export class AsyncIncrementCountAction extends Action<CounterState, number>  {
    public invoke(timeout: number): Feature<CounterState> {
        return async ({ mutate, state }) => {
            await new Promise(resolve => setTimeout(resolve, timeout))
            mutate(s => s.clone({
                count: s.count + 1
            }))
        };
    }
}
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
import { Store, State, Message, action, store } from "relux.js";

/**
 * State for counter.
 */
export class CounterState extends State<CounterState> {
    count = 0;
    isLoading = false;
    timeSec = 0;

    get next() {
        return this.count + 1;
    }
}

// Mutaion messages
export class CountUp extends Message { }
export class BeginLoading extends Message { }
export class EndLoading extends Message { }

// Action messages
export class CountUpWithTimer extends Message {
}

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
    async countUpWithTimer(timeout: number): Promise<void> {
        this.mutate(new BeginLoading({}));

        await this.delay(timeout);

        this.mutate(new CountUp({}));
        this.mutate(new EndLoading({}));
    }

    private async delay(timeout: number) {
        await new Promise(resolve => setTimeout(resolve, timeout));
    }
}

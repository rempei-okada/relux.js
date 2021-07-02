import { constructor } from "./constructor";
import { Message, Store } from "./Store";

interface FunctionalStoreContext<TState> {
    mutate: (message: Message) => void;
    getState: () => TState;
}

interface FunctionalStoreDefineOption<TState, TActions> {
    name: string;
    initialState: () => TState;
    mutation: (state: TState, message: Message) => TState;
    actions: (context: FunctionalStoreContext<TState>) => TActions;
}

type FunctionalStore<TState, TActions> = constructor<Store<TState> & TActions>;

export const defineStore = <TState, TActions>(
    define: FunctionalStoreDefineOption<TState, TActions>
): FunctionalStore<TState, TActions> => {
    return class extends Store<TState> {
        static slice = define.name;
        constructor() {
            super(define.initialState(), define.mutation);

            const context: FunctionalStoreContext<TState> = {
                mutate: this.mutate.bind(this),
                getState: () => this.state
            }

            // define actions
            const actions = define.actions(context);
            for (const key in actions) {
                (this as any)[key] = actions[key];
            }
        }
    } as any;
};

type FunctionalMessage<TPayload> = [
    (payload: TPayload) => Message,
    (message: Message) => boolean,
    (message: Message) => TPayload
]

export const defineMessage = <TPayload = {} | null | undefined>(name?: string): FunctionalMessage<TPayload> => {
    const M = class extends Message<TPayload> {
        static message = name;
    }
    return [
        (payload: TPayload) => new M(payload),
        (message: Message) => message instanceof M,
        (message: Message) => message.payload as TPayload
    ];
}


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
declare type FunctionalStore<TState, TActions> = constructor<Store<TState> & TActions>;
export declare const defineStore: <TState, TActions>(define: FunctionalStoreDefineOption<TState, TActions>) => constructor<Store<TState> & TActions>;
declare type FunctionalMessage<TPayload> = [
    (payload: TPayload) => Message,
    (message: Message) => boolean,
    (message: Message) => TPayload
];
export declare const defineMessage: <TPayload = {} | null | undefined>(name?: string | undefined) => FunctionalMessage<TPayload>;
export {};

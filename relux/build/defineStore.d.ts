import { constructor } from "./constructor";
import { Message, Store } from "./Store";
interface StoreDefineOption<TState, TActions> {
    name: string;
    initialState: () => TState;
    mutation: (state: TState, message: Message) => TState;
    actions: (mutate: (message: Message) => void) => TActions;
}
declare type FunctionalStore<TState, TActions> = constructor<Store<TState> & TActions>;
export declare const defineStore: <TState, TActions>(define: StoreDefineOption<TState, TActions>) => constructor<Store<TState> & TActions>;
export {};

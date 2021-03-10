import { constructor, Store } from "relux.js";
export declare const useObserver: <TState, TSelectedState>(storeType: constructor<Store<TState>>, selector?: ((state: TState) => TSelectedState) | undefined) => TSelectedState;

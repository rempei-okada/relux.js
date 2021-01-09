import { Action } from "index";
import { constructor, Feature } from "./Feature";
import { Slice, Store } from "./Store";

export type Slices<TRootState> = {
    [K in keyof TRootState]: Slice<TRootState[K]>
}

/**
 * Store Creation option.
 */
export interface StoreOption<TRootState> {
    slices: Slices<TRootState>;
    services?: constructor<object>[]
}

/**
 * Create a store.
 * @param option store option
 * @typedef TRootState RootState type
 */
export function createStore<TRootState>(option: StoreOption<TRootState>) {
    const store = new Store<TRootState>(option);
    return store;
}

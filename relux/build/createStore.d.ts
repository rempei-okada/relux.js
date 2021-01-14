import { constructor } from "./Feature";
import { Slice, Store } from "./Store";
export declare type Slices<TRootState> = {
    [K in keyof TRootState]: Slice<TRootState[K]>;
};
/**
 * Store Creation option.
 */
export interface StoreOption<TRootState> {
    slices: Slices<TRootState>;
    services?: constructor<object>[];
}
/**
 * Create a store.
 * @param option store option
 * @typedef TRootState RootState type
 */
export declare function createStore<TRootState>(option: StoreOption<TRootState>): Store<TRootState>;

import { Provider, StoreOption } from "./Store";
/**
 * Create a store.
 * @param option store option
 */
export declare function createProvider(option: StoreOption): Provider<{
    [key: string]: any;
}>;

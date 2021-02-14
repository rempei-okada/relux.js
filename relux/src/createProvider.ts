import { Provider, StoreOption } from "./Store";

/**
 * Create a store.
 * @param option store option
 */
export function createProvider(option: StoreOption) {
    return new Provider(option);
}

import { Provider, StoreOption } from "./Store";

/**
 * Create a store.
 * @param option store option
 */
export function createProvider(option: StoreOption) {
    try {
        return new Provider(option);
    }
    catch (ex) {
        console.error(ex.message);
        throw new Error(ex.message);
    }
}

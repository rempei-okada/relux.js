import { useContext } from "react";
import { Store } from "relux.js";
import { StoreContext } from "./StoreContext";

export const useStore = <TRootState = any>() => {
    const store = useContext(StoreContext);
    if (store) {
        return store as Store<TRootState>;
    }
    else {
        throw new Error("Store is not specified");
    }
};

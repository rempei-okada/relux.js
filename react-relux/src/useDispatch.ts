import { useContext } from "react";
import { constructor, store, Store } from "relux.js";
import { StoreContext } from "./StoreContext";

export const useDispatch = (storeType?: constructor<Store>) => {
    const provider = useContext(StoreContext);
    if (provider) {
        if(storeType){
            return provider.resolve(storeType).dispatch.bind(provider)
        }

        return provider.dispatch.bind(provider);
    }
    else {
        throw new Error("Store is not specified");
    }
};

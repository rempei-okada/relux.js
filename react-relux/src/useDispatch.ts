import { useContext } from "react";
import { StoreContext } from "./StoreContext";

export const useDispatch = () => {
    const store = useContext(StoreContext);
    if (store) {
        return store.dispatch.bind(store);
    }
    else {
        throw new Error("Store is not specified");
    }
};

import { useContext } from "react";
import { StoreContext } from "./StoreContext";

export const useStore = () => {
    const store = useContext(StoreContext);
    if (store) {
        return store;
    }
    else {
        throw new Error("Store is not specified");
    }
};

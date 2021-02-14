import { useContext } from "react";
import { Provider } from "relux.js";
import { StoreContext } from "./StoreContext";

export const useProvider = () => {
    const prider = useContext(StoreContext);
    if (prider) {
        return prider as Provider;
    }
    else {
        throw new Error("Store is not specified");
    }
};

import React from "react";
import { Store } from "relux.js";
import { StoreContext } from "./StoreContext";

interface ProviderProps {
    store: Store;
    children: React.ReactNode;
}

export function Provider({ children, store }: ProviderProps) {
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
}
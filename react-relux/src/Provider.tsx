import React from "react";
import { Provider } from "relux.js";
import { StoreContext } from "./StoreContext";

interface ProviderProps {
    provider: Provider;
    children: React.ReactNode;
}

export function StoreProvider({ children, provider }: ProviderProps) {
    return (
        <StoreContext.Provider value={provider}>
            {children}
        </StoreContext.Provider>
    );
}
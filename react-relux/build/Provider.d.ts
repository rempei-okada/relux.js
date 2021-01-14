import React from "react";
import { Store } from "relux.js";
interface ProviderProps {
    store: Store;
    children: React.ReactNode;
}
export declare function Provider({ children, store }: ProviderProps): JSX.Element;
export {};

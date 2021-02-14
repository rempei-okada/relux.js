import React from "react";
import { Provider } from "relux.js";
interface ProviderProps {
    provider: Provider;
    children: React.ReactNode;
}
export declare function StoreProvider({ children, provider }: ProviderProps): JSX.Element;
export {};

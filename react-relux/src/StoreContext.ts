import React from "react";
import { Provider } from "relux.js";

export const StoreContext = React.createContext<Provider | null>(null);

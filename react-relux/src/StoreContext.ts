import React from "react";
import { Store } from "relux.js";

export const StoreContext = React.createContext<Store | null>(null);

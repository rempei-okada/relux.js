import { useEffect, useReducer, useRef } from "react";
import { useStore } from "./useStore";

export const useObserver = <T = {}, U = unknown>(selector: (state: T) => U): U => {
    const [, forceRender] = useReducer((s) => s + 1, 0);
    const store = useStore();
    const state = useRef<U>(selector(store.getState()));

    useEffect(() => {
        const subscription = store.subscribe(e => {
            const newState = selector(store.getState());
            if (state.current !== newState) {
                state.current = newState;
                forceRender();
            }
        });

        return () => subscription.dispose();
    }, [store]);

    return selector(store.getState());
}
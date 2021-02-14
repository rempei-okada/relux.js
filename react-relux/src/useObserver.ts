import { useEffect, useReducer, useRef } from "react";
import { useProvider } from "./useProvider";
import { constructor, Store } from "relux.js";

export const useObserver = <
    TState,
    TSelectedState>(
        storeType: constructor<Store<TState>>,
        selector?: (state: TState) => TSelectedState
    ): TSelectedState => {
    const _selector = selector || ((s: TState) => s as any as TSelectedState);
    const [, forceRender] = useReducer((s) => s + 1, 0);
    const provider = useProvider();
    const state = useRef(_selector(provider.resolve(storeType).state));

    useEffect(() => {
        const store = provider.resolve(storeType) as Store<TState>;
        const subscription = store.subscribe(_ => {
            const newState = _selector(store.state);
            if (state.current !== newState) {
                state.current = newState;
                forceRender();
            }
        });

        return () => subscription.dispose();
    }, [provider]);

    return _selector(provider.resolve(storeType).state);
}
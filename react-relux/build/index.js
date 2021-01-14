import React, { useContext, useReducer, useRef, useEffect } from 'react';

var StoreContext = React.createContext(null);

function Provider(_a) {
    var children = _a.children, store = _a.store;
    return (React.createElement(StoreContext.Provider, { value: store }, children));
}

var useStore = function () {
    var store = useContext(StoreContext);
    if (store) {
        return store;
    }
    else {
        throw new Error("Store is not specified");
    }
};

var useObserver = function (selector) {
    var _a = useReducer(function (s) { return s + 1; }, 0), forceRender = _a[1];
    var store = useStore();
    var state = useRef(selector(store.getState()));
    useEffect(function () {
        var subscription = store.subscribe(function (e) {
            var newState = selector(store.getState());
            if (state.current !== newState) {
                state.current = newState;
                forceRender();
            }
        });
        return function () { return subscription.dispose(); };
    }, [store]);
    return selector(store.getState());
};

var useDispatch = function () {
    var store = useContext(StoreContext);
    if (store) {
        return store.dispatch.bind(store);
    }
    else {
        throw new Error("Store is not specified");
    }
};

export { Provider, StoreContext, useDispatch, useObserver, useStore };

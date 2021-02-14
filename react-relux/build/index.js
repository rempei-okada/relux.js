import React, { useContext, useReducer, useRef, useEffect } from 'react';

var StoreContext = React.createContext(null);

function StoreProvider(_a) {
    var children = _a.children, provider = _a.provider;
    return (React.createElement(StoreContext.Provider, { value: provider }, children));
}

var useProvider = function () {
    var prider = useContext(StoreContext);
    if (prider) {
        return prider;
    }
    else {
        throw new Error("Store is not specified");
    }
};

var useObserver = function (storeType, selector) {
    var _selector = selector || (function (s) { return s; });
    var _a = useReducer(function (s) { return s + 1; }, 0), forceRender = _a[1];
    var provider = useProvider();
    var state = useRef(_selector(provider.resolve(storeType).state));
    useEffect(function () {
        var store = provider.resolve(storeType);
        var subscription = store.subscribe(function (_) {
            var newState = _selector(store.state);
            if (state.current !== newState) {
                state.current = newState;
                forceRender();
            }
        });
        return function () { return subscription.dispose(); };
    }, [provider]);
    return _selector(provider.resolve(storeType).state);
};

var useDispatch = function (storeType) {
    var provider = useContext(StoreContext);
    if (provider) {
        if (storeType) {
            return provider.resolve(storeType).dispatch.bind(provider);
        }
        return provider.dispatch.bind(provider);
    }
    else {
        throw new Error("Store is not specified");
    }
};

export { StoreContext, StoreProvider, useDispatch, useObserver, useProvider };

import React, { useEffect, useRef, useState } from "react";
import { Provider, useStore, useObserver } from "react-relux";
import { constructor } from "tsyringe/dist/typings/types";
import { AsyncIncrementCountAction } from "../demo/counter";
import { IncrementalFibonacciAction } from "../demo/fibonacci";
import { RootState, store } from "../demo/store";

export default () => {
    return (
        <Provider store={store}>
            <div style={{ display: "flex" }}>
                <div style={{ padding: "24px" }}>
                    <Counter />
                    <FibCounter />
                </div>
                <div style={{ flexGrow: 1, padding: "24px" }}>
                    <History />
                </div>
            </div>
        </Provider>
    );
};

function Counter() {
    const store = useStore();
    const count = useObserver((s: RootState) => s.counter.count);
    const next = useObserver((s: RootState) => s.counter.next);

    function increment() {
        store.dispatch(AsyncIncrementCountAction, 1000)
    }

    return (
        <div>
            <h1>Counter</h1>
            <button onClick={increment}>Count</button>
            <p>Counter will increment after 1000ms</p><br />
            <div>Count: {count}</div>
            <div>Next: {next}</div>
            <br />
        </div>
    );
}

function FibCounter() {
    const store = useStore();
    const counter = useObserver((s: RootState) => s.fib);

    function increment() {
        store.dispatch(IncrementalFibonacciAction, undefined)
    }

    return (
        <div>
            <h1>Fibonacci counter</h1>
            <button onClick={increment}>Compute</button>
            <p>Compute Fibonacci number when N {"<"} 40</p>
            <p>Counter will increment after 1000ms</p><br />
            <div>Fib: {counter.count}</div>
            <div>N: {counter.n}</div>
            <div style={{ maxWidth: "340px" }}>History: {counter.history.map(h => `${h}, `)}</div>
        </div>
    );
}

function History() {
    const store = useStore();
    const [histories, setHistories] = useState<any[]>([]);
    const i = useRef(0);


    useEffect(() => {
        const s = store.subscribe(e => {
            setHistories([...histories, { key: i.current, ...e }]);
            i.current++;
        });

        return () => s.dispose();
    }, [histories]);

    return (
        <>
            <h2>History</h2>
            <div style={{
                height: "calc(100vh - 180px)",
                overflowY: "scroll",
                background: "#f7f7f7",
                padding: "20px",
            }}>
                {
                    histories.map(h => (<div key={h.key}>
                        <div>Slice: {h.slice}</div>
                        <div>Action: {h.action}</div>
                        <div style={{ whiteSpace: "pre", padding: "16px", background: "#f0f0f0" }}>{JSON.stringify(h.state, null, 4)}</div>
                        <hr />
                    </div>))
                }
            </div>
        </>
    );
}

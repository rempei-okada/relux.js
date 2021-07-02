import React, { useEffect, useRef, useState } from "react";
import { StoreProvider, useProvider, useObserver, useStore } from "react-relux";
import { CounterStore, CountUpWithTimer } from "../demo/counter";
import { FibStore, CalcFib } from "../demo/fibonacci";
import { provider, HogeStore } from "../demo/store";

export default () => {
    return (
        <StoreProvider provider={provider}>
            <div style={{ display: "flex" }}>
                <div style={{ padding: "24px" }}>
                    <Hoge />
                    <Counter />
                    <FibCounter />
                </div>
                <div style={{ flexGrow: 1, padding: "24px" }}>
                    <History />
                </div>
            </div>
        </StoreProvider>
    );
};

function Hoge() {
    const store = useStore(HogeStore);
    const count = useObserver(HogeStore, s => s.hoge);

    function increment() {
        store.countUp();
    }

    return (
        <div>
            <h1>Counter</h1>
            <button onClick={increment}>Count</button>
            <p>Counter will increment after 1000ms</p><br />
            <div>Count: {count}</div>
            {/* <div>Next: {next}</div>
            <div>isLoading : {counter.isLoading ? "YES" : "NO"}</div> */}
            <br />
        </div>
    );
}


function Counter() {
    const store = useStore(CounterStore);
    const count = useObserver(CounterStore, s => s.count);
    const next = useObserver(CounterStore, s => s.next);
    const counter = useObserver(CounterStore, s => s);

    function increment() {
        store.countUpWithTimer(1000);
    }

    return (
        <div>
            <h1>Counter</h1>
            <button onClick={increment}>Count</button>
            <p>Counter will increment after 1000ms</p><br />
            <div>Count: {count}</div>
            <div>Next: {next}</div>
            <div>isLoading : {counter.isLoading ? "YES" : "NO"}</div>
            <br />
        </div>
    );
}

function FibCounter() {
    const counter = useObserver(FibStore, s => s);
    const store = useStore(FibStore);

    function increment() {
        store.calc();
    }

    return (
        <div>
            <h1>Fibonacci counter</h1>
            <button onClick={increment}>Compute</button>
            <p>Compute Fibonacci number when N {"<"} 40</p>
            <p>Counter will increment after 1000ms</p><br />
            <div>Fib: {counter.count}</div>
            <div>N: {counter.n}</div>
            <div style={{ maxWidth: "340px" }}>History: [{counter.history.map(h => `${h}, `)}]</div>
        </div>
    );
}

function History() {
    const provider = useProvider();
    const [histories, setHistories] = useState<any[]>([]);
    const i = useRef(0);

    useEffect(() => {
        const s = provider.subscribe(e => {
            setHistories([...histories, {
                key: i.current,
                ...e,
                time: new Date(),
                root: provider.getRootStateTree()
            }]);
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
                    histories.map((h, i) => (<>
                        <details key={h.key}>
                            <summary>
                                <div style={{ display: "flex" }}>
                                    {`${h.key} ${h.store}`}
                                    <strong style={{ marginLeft: "8px", color: "#11b7af" }}>{h.message.type}</strong>
                                    <div style={{ marginLeft: "8px" }}>{toString(h.time)}</div>
                                </div>
                            </summary>
                            <div style={{ whiteSpace: "pre", padding: "16px", background: "#f0f0f0" }}>{JSON.stringify(h.message, null, 4)}</div>
                            <div>State</div>
                            <div style={{ whiteSpace: "pre", padding: "16px", background: "#f0f0f0" }}>{JSON.stringify(h.root, null, 4)}</div>
                        </details>
                        <hr />
                    </>))
                }
            </div>
        </>
    );
}

function toString(date: Date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
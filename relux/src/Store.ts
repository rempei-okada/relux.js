import { ReflectiveInjector, Injectable, Injector } from "injection-js";
import { constructor } from "./Feature";
import { Action } from "Action";
import { StoreOption } from "createStore";

interface StateChangedEventArgs<TState> {
    state: ValueOf<TState>;
    slice: keyof TState;
    action: string;
}

type ValueOf<T> = T[keyof T];

interface Subscription {
    dispose: () => void;
}

export interface Slice<T = any> {
    name: string;
    actions: constructor<Action<T, any>>[];
    state: T;
}

export class Store<TRootState = any> {
    private state!: TRootState;
    private _observers: ((params: StateChangedEventArgs<TRootState>) => void)[] = [];
    private readonly _container: ReflectiveInjector;
    private slices: Slice[] = [];
    private actionInfos: { [key: string]: { sliceName: string } } = {};

    constructor(option: StoreOption<TRootState>) {
        const ctors = [];

        for (const key in option.slices) {
            const slice = option.slices[key];
            this.slices = [...this.slices, slice];
            for (const action of slice.actions) {
                ctors.push(action);
                this.actionInfos[action as any as string] = { sliceName: slice.name };
                this.state = { ...this.state, [slice.name]: slice.state };
            }
        }

        if (option.services) {
            for (const s of option.services) {
                ctors.push(s);
            }
        }

        this._container = ReflectiveInjector.resolveAndCreate(ctors);
    }

    public getState(): TRootState {
        return this.state;
    }

    public mutate<T extends keyof TRootState>(
        sliceName: T,
        mutation: (state: TRootState[T]) => TRootState[T],
        action: string = "no action"
    ): void {
        const old = this.state[sliceName];
        const newState = mutation(old);
        this.state = {
            ...this.state,
            [sliceName]: newState
        };
        this.invokeObservers(sliceName, newState, action);
    }

    public async dispatch
        <
            TState,
            TPayload
        >(
            ctor: constructor<Action<TState, TPayload>>,
            payload: TPayload
        ): Promise<void> {
        const action = this._container.get(ctor) as Action<TState, TPayload>;

        const sliceName = this.getSliceNameFromAction(ctor);
        const state = (this.getState() as any)[sliceName] as TState;

        if (!state) {
            throw new Error(`Slice "${sliceName}" is not found.`);
        }

        const feature = action.invoke(payload);
        feature({
            dispatch: (ctor, payload) => this.dispatch(ctor, payload),
            mutate: m => this.mutate(
                sliceName as any,
                m as any,
                (action as any).name || ctor.name
            ),
            state: state
        });
    }

    public subscribe(observer: ((params: StateChangedEventArgs<TRootState>) => void)): Subscription {
        this._observers = [...this._observers, observer];

        return {
            dispose: () => {
                this._observers = this._observers.filter(o => o !== observer);
            }
        };
    }

    private getSliceNameFromAction<TState, TPayload>(action: constructor<Action<TState, TPayload>>): string {
        const slice = this.actionInfos[action as any as string];
        if (!slice) {
            throw new Error(`Action ${action} is not registerd.`);
        }

        return slice.sliceName;
    }

    private invokeObservers(slice: keyof TRootState, state: ValueOf<TRootState>, action: string) {
        for (const observer of this._observers) {
            observer({ action, state, slice });
        }
    }
}

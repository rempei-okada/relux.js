import { constructor } from "./Feature";
import { Action } from "Action";
import { StoreOption } from "createStore";
interface StateChangedEventArgs<TState> {
    state: ValueOf<TState>;
    slice: keyof TState;
    action: string;
}
declare type ValueOf<T> = T[keyof T];
interface Subscription {
    dispose: () => void;
}
export interface Slice<T = any> {
    name: string;
    actions: constructor<Action<T, any>>[];
    state: T;
}
export declare class Store<TRootState = any> {
    private state;
    private _observers;
    private readonly _container;
    private slices;
    private actionInfos;
    constructor(option: StoreOption<TRootState>);
    getState(): TRootState;
    mutate<T extends keyof TRootState>(sliceName: T, mutation: (state: TRootState[T]) => TRootState[T], action?: string): void;
    dispatch<TState, TPayload>(ctor: constructor<Action<TState, TPayload>>, payload: TPayload): Promise<void>;
    subscribe(observer: ((params: StateChangedEventArgs<TRootState>) => void)): Subscription;
    private getSliceNameFromAction;
    private invokeObservers;
}
export {};

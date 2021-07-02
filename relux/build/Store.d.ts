import { constructor } from "./constructor";
interface StateChangedEventArgs<TState> {
    state: TState;
    store: string;
    message: Message;
}
interface Subscription {
    dispose: () => void;
}
export declare abstract class Message<TPayload = {} | void> {
    readonly payload: TPayload;
    readonly type: string;
    constructor(payload: TPayload);
}
declare type MutationMethod<TState> = (state: TState, message: Message) => TState;
export declare abstract class Store<TState = object> {
    private _state;
    private observers;
    private readonly mutation;
    static slice: string;
    static parameters: constructor<any>[];
    get state(): TState;
    constructor(initialState: TState, mutation: MutationMethod<TState>);
    protected mutate(message: Message): void;
    subscribe(observer: (e: StateChangedEventArgs<TState>) => void): Subscription;
}
export interface StoreOption {
    stores: constructor<Store<any>>[];
    services?: constructor<object>[];
}
export declare type StoreClass<TStore extends Store<TState>, TState> = {
    new (...args: any[]): TStore & Store<TState>;
};
export declare function store({ name }: {
    name: string;
}): any;
export declare function action(name?: string): (target: Store, name: string, desc: PropertyDescriptor) => void;
export declare class Provider<TRootState = {
    [key: string]: any;
}> {
    private readonly _container;
    private readonly _storesDefines;
    private observers;
    getRootStateTree(): TRootState;
    constructor(option: StoreOption);
    subscribe(observer: (e: StateChangedEventArgs<object>) => void): Subscription;
    resolve<T>(type: constructor<T>): T;
}
export {};

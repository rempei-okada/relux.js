import { constructor } from "./constructor";
interface StateChangedEventArgs<TState> {
    state: TState;
    store: string;
    message: Message;
}
interface Subscription {
    dispose: () => void;
}
export declare abstract class Message<TPayload = undefined> {
    readonly payload: TPayload;
    readonly type: string;
    constructor(payload: TPayload);
}
declare type MutationMethod<TState> = (state: TState, message: Message) => TState;
declare type ActionMethod<TMessage extends Message = Message> = (message: TMessage) => Promise<void>;
export declare abstract class Store<TState = object> {
    private _state;
    private observers;
    private readonly mutation;
    static slice: string;
    static parameters: constructor<any>[];
    private get _actions();
    get state(): TState;
    constructor(initialState: TState, mutation: MutationMethod<TState>);
    bindAction<TMessage extends Message>(messageType: constructor<TMessage>, action: ActionMethod<TMessage>): ({
        dispose: () => void;
    });
    protected mutate(message: Message): void;
    dispatch(message: Message): Promise<void>;
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
export declare function action(message: constructor<Message>): (target: Store, _: string, desc: PropertyDescriptor) => void;
export declare class Provider<TRootState = {
    [key: string]: any;
}> {
    private readonly _container;
    private readonly _storesDefines;
    private observers;
    getRootStateTree(): TRootState;
    constructor(option: StoreOption);
    subscribe(observer: (e: StateChangedEventArgs<object>) => void): Subscription;
    dispatch(message: Message): Promise<void>;
    resolve(type: constructor<any>): any;
}
export {};

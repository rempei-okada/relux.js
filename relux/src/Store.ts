import { ReflectiveInjector, Injectable, Injector } from "injection-js";
import { constructor } from "./constructor";

interface StateChangedEventArgs<TState> {
    state: TState;
    store: string;
    message: Message;
}

interface Subscription {
    dispose: () => void;
}

export abstract class Message { }

type MutationMethod<TState> = (state: TState, message: Message) => TState;

type ActionMethod<TMessage extends Message = Message> = (message: TMessage) => Promise<void>;

export abstract class Store<TState = object> {
    private _state: TState;
    private observers: Observer<TState>[] = [];
    private readonly mutation: MutationMethod<TState>;

    public static slice = "";
    public static parameters: constructor<any>[] = [];

    private get _actions(): Map<constructor<Message>, ActionMethod> {
        if (!(this.constructor.prototype as any).toBindActions) {
            (this.constructor.prototype as any) = new Map();
        }
        return (this.constructor.prototype as any).toBindActions;
    }

    public get state(): TState {
        return this._state;
    }

    constructor(initialState: TState, mutation: MutationMethod<TState>) {
        this._state = initialState;
        this.mutation = mutation;
    }

    public bindAction<TMessage extends Message>(messageType: constructor<TMessage>, action: ActionMethod<TMessage>): ({ dispose: () => void }) {
        if (this._actions.has(messageType)) {
            throw new Error(`Action "${messageType.name} : ${action.name} is already exists."`);
        }
        else {
            this._actions.set(messageType, action as ActionMethod);
        }

        return {
            dispose: () => {
                this._actions.delete(messageType);
            }
        };
    }

    protected mutate(message: Message): void {
        this._state = this.mutation(this._state, message);

        for (const observer of this.observers) {
            observer({
                message: message,
                store: (this.constructor as any).slice || this.constructor.name,
                state: this.state
            })
        }
    }

    public async dispatch(message: Message): Promise<void> {
        const action = this._actions.get(message.constructor as constructor<Message>);
        if (!action) {
            throw new Error(`Message "${message.constructor.name} is not registered`);
        }

        await action.bind(this)(message);
    }

    public subscribe(observer: (e: StateChangedEventArgs<TState>) => void): Subscription {
        this.observers = [...this.observers, observer];

        return {
            dispose: () => {
                this.observers = this.observers.filter(o => o !== observer);
            }
        };
    }
}

export interface StoreOption {
    stores: constructor<Store<any>>[];
    services?: constructor<object>[];
}

type Observer<TState> = (e: StateChangedEventArgs<TState>) => void;
type StoreDecorator = <TStore extends Store<TState>, TState>
    (target: StoreClass<TStore, TState>) => StoreClass<TStore, TState>;

export type StoreClass<TStore extends Store<TState>, TState> = {
    new(...args: any[]): TStore & Store<TState>;
};

export function store({ name }: { name: string }): any {
    return function (ctor: any) {
        if (!(ctor.prototype instanceof Store)) {
            throw new Error("@store() decorator class must extends Store class.");
        }

        ctor.slice = name;

        return Injectable()(ctor);
    } as any;
}

export function action(message: constructor<Message>) {
    return function (target: Store, _: string, desc: PropertyDescriptor) {
        if (!(target as any).toBindActions) {
            (target as any).toBindActions = new Map();
        }

        if (target instanceof Store) {
            (target as any).toBindActions.set(message, desc.value);
        }
        else {
            throw new Error(`@Action(Message) decorator can use in Store<TState> class only.`)
        }
    }
}

export class Provider<TRootState = { [key: string]: any }> {
    private readonly _container: ReflectiveInjector;
    private readonly _storesDefines: { name: string, type: constructor<object> }[];
    private observers: Observer<object>[] = [];

    public getRootStateTree(): TRootState {
        return this._storesDefines.reduce((x, y) => ({
            ...x,
            [y.name]: this._container.get(y.type).state
        }), {} as TRootState);
    }

    constructor(option: StoreOption) {
        this._container = ReflectiveInjector.resolveAndCreate([
            ...option.services || [],
            ...option.stores
        ]);

        for (const ctor of option.stores) {
            const store = this._container.get(ctor) as Store;

            store.subscribe((e: StateChangedEventArgs<object>) => {
                for (const observer of this.observers) {
                    observer(e);
                }
            });
        }

        this._storesDefines = option.stores.map(c => ({
            name: (c as any).slice,
            type: c
        }));
    }

    public subscribe(observer: (e: StateChangedEventArgs<object>) => void): Subscription {
        this.observers = [...this.observers, observer];

        return {
            dispose: () => {
                this.observers = this.observers.filter(o => o !== observer);
            }
        };
    }

    public async dispatch(message: Message): Promise<void> {
        for (const s of this._storesDefines) {
            const store = this._container.get(s.type) as Store;
            if (store) {
                try {
                    await store.dispatch(message);
                    return;
                }
                catch {

                }
            }
        }

        throw new Error(`${message.constructor.name} is not bound with action. `)
    }

    public resolve(type: constructor<any>) {
        return this._container.get(type);
    }
}

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

export abstract class Message<TPayload = {} | void> {
    readonly payload: TPayload;
    readonly type: string;
    constructor(payload: TPayload) {
        this.payload = payload!;
        this.type = (this.constructor as any).message || this.constructor.name;
    }
}

type MutationMethod<TState> = (state: TState, message: Message) => TState;

export abstract class Store<TState = object> {
    private _state: TState;
    private observers: Observer<TState>[] = [];
    private readonly mutation: MutationMethod<TState>;

    public static slice = "";
    public static parameters: constructor<any>[] = [];

    public get state(): TState {
        return this._state;
    }

    constructor(initialState: TState, mutation: MutationMethod<TState>) {
        this._state = initialState;
        this.mutation = (state, message) => {
            return mutation(state, message);
        }
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

export function action(name?: string) {
    return function (target: Store, name: string, desc: PropertyDescriptor) {
        if (!(target as any).toBindActions) {
            (target as any).toBindActions = new Map();
        }

        console.log(target, name, desc);

        if (target instanceof Store) {
            const func = desc.value;
            desc.value = function () {
                console.log(" -- log --");
                const result = Reflect.apply(func, this, arguments);

                return result;
            };
        }
        else {
            throw new Error(`@Action(Message) decorator can use in Store<TState> class only.`)
        }
    }
}

export class Provider<TRootState = { [key: string]: any }> {
    private readonly _container!: ReflectiveInjector;
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
            try {
                const store = this._container!.get(ctor) as Store;

                store.subscribe((e: StateChangedEventArgs<object>) => {
                    for (const observer of this.observers) {
                        observer(e);
                    }
                });
            }
            catch (ex) {
                throw new Error(`Failed to create relux provider "${ex.message}" \n`);
            }
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

    public resolve<T>(type: constructor<T>) {
        return this._container.get(type) as T;
    }
}

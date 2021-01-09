import { Action } from "index";
import { Store } from "./Store";

export type constructor<T> = {
    new(...args: any[]): T,
    name: string;
};

export type Dispatch = <
    TState,
    TPayload
    >(
    ctor: constructor<Action<TState, TPayload>>,
    payload: TPayload
) => Promise<void> | void

export interface FeatureProps<TState> {
    dispatch: Dispatch;
    mutate: (mutation: (state: TState) => TState) => void;
    state: TState;
}

export type Feature<TState> =
    (props: FeatureProps<TState>) => Promise<void> | void;

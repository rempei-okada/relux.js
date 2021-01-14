import { Action } from "index";
export declare type constructor<T> = {
    new (...args: any[]): T;
    name: string;
};
export declare type Dispatch = <TState, TPayload>(ctor: constructor<Action<TState, TPayload>>, payload: TPayload) => Promise<void> | void;
export interface FeatureProps<TState> {
    dispatch: Dispatch;
    mutate: (mutation: (state: TState) => TState) => void;
    state: TState;
}
export declare type Feature<TState> = (props: FeatureProps<TState>) => Promise<void> | void;

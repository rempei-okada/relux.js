import { Feature } from "./Feature";
export declare abstract class Action<TState, TPayload> {
    abstract invoke(payload: TPayload): Feature<TState>;
}

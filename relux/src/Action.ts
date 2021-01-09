import { Feature } from "./Feature";

export abstract class Action<TState, TPayload>{
    abstract invoke(payload: TPayload): Feature<TState>;
}
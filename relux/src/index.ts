import 'reflect-metadata';
import { Store, Provider, Message, action, store } from "./Store";
import { State } from "./State";
import { createProvider } from "./createProvider";
import {
    Injectable,
    Inject
} from "injection-js";
export * from "./constructor";

function service() {
    return Injectable();
}

export {
    Store,
    Provider,
    State,
    createProvider,
    service,
    Inject,
    Message,
    action,
    store
}

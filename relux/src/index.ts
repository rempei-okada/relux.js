import 'reflect-metadata';
import { Store, Provider, Message, action, store } from "./Store";
import { State } from "./State";
import { createProvider } from "./createProvider";
import {
    Injectable,
    Inject
} from "injection-js";
export * from "./constructor";
import { defineStore, defineMessage } from "./functionalWrapper";

const service = () => {
    return Injectable();
}

const getPayload = <T extends Message>(message: Message): T["payload"] => message.payload;


export {
    Store,
    Provider,
    State,
    createProvider,
    service,
    Inject,
    Message,
    action,
    store,
    getPayload,

    // Functional options
    defineStore,
    defineMessage
}

import 'reflect-metadata';
import { Store, Provider, Message, action, store } from "./Store";
import { State } from "./State";
import { createProvider } from "./createProvider";
import { Inject } from "injection-js";
export * from "./constructor";
declare function service(): any;
export { Store, Provider, State, createProvider, service, Inject, Message, action, store };

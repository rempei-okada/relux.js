import 'reflect-metadata';
import { Injectable, ReflectiveInjector } from 'injection-js';
export { Inject } from 'injection-js';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var Message = /** @class */ (function () {
    function Message() {
    }
    return Message;
}());
var Store = /** @class */ (function () {
    function Store(initialState, mutation) {
        this.observers = [];
        this._state = initialState;
        this.mutation = mutation;
    }
    Object.defineProperty(Store.prototype, "_actions", {
        get: function () {
            if (!this.constructor.prototype.toBindActions) {
                this.constructor.prototype.toBindActions = new Map();
            }
            return this.constructor.prototype.toBindActions;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    Store.prototype.bindAction = function (messageType, action) {
        var _this = this;
        if (this._actions.has(messageType)) {
            throw new Error("Action \"" + messageType.name + " : " + action.name + " is already exists.\"");
        }
        else {
            this._actions.set(messageType, action);
        }
        return {
            dispose: function () {
                _this._actions.delete(messageType);
            }
        };
    };
    Store.prototype.mutate = function (message) {
        this._state = this.mutation(this._state, message);
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer({
                message: message,
                store: this.constructor.slice || this.constructor.name,
                state: this.state
            });
        }
    };
    Store.prototype.dispatch = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        action = this._actions.get(message.constructor);
                        if (!action) {
                            throw new Error("Message \"" + message.constructor.name + " is not registered");
                        }
                        return [4 /*yield*/, action.bind(this)(message)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Store.prototype.subscribe = function (observer) {
        var _this = this;
        this.observers = __spreadArrays(this.observers, [observer]);
        return {
            dispose: function () {
                _this.observers = _this.observers.filter(function (o) { return o !== observer; });
            }
        };
    };
    Store.slice = "";
    Store.parameters = [];
    return Store;
}());
function store(_a) {
    var name = _a.name;
    return function (ctor) {
        if (!(ctor.prototype instanceof Store)) {
            throw new Error("@store() decorator class must extends Store class.");
        }
        ctor.slice = name;
        return Injectable()(ctor);
    };
}
function action(message) {
    return function (target, _, desc) {
        if (!target.toBindActions) {
            target.toBindActions = new Map();
        }
        if (target instanceof Store) {
            target.toBindActions.set(message, desc.value);
        }
        else {
            throw new Error("@Action(Message) decorator can use in Store<TState> class only.");
        }
    };
}
var Provider = /** @class */ (function () {
    function Provider(option) {
        var _this = this;
        this.observers = [];
        this._container = ReflectiveInjector.resolveAndCreate(__spreadArrays(option.services || [], option.stores));
        for (var _i = 0, _a = option.stores; _i < _a.length; _i++) {
            var ctor = _a[_i];
            var store_1 = this._container.get(ctor);
            store_1.subscribe(function (e) {
                for (var _i = 0, _a = _this.observers; _i < _a.length; _i++) {
                    var observer = _a[_i];
                    observer(e);
                }
            });
        }
        this._storesDefines = option.stores.map(function (c) { return ({
            name: c.slice,
            type: c
        }); });
    }
    Provider.prototype.getRootStateTree = function () {
        var _this = this;
        return this._storesDefines.reduce(function (x, y) {
            var _a;
            return (__assign(__assign({}, x), (_a = {}, _a[y.name] = _this._container.get(y.type).state, _a)));
        }, {});
    };
    Provider.prototype.subscribe = function (observer) {
        var _this = this;
        this.observers = __spreadArrays(this.observers, [observer]);
        return {
            dispose: function () {
                _this.observers = _this.observers.filter(function (o) { return o !== observer; });
            }
        };
    };
    Provider.prototype.dispatch = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, s, store_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _i = 0, _a = this._storesDefines;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        s = _a[_i];
                        store_2 = this._container.get(s.type);
                        if (!store_2) return [3 /*break*/, 5];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, store_2.dispatch(message)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/];
                    case 4:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: throw new Error(message.constructor.name + " is not bound with action. ");
                }
            });
        });
    };
    Provider.prototype.resolve = function (type) {
        return this._container.get(type);
    };
    return Provider;
}());

/**
 * Base class for the state as class instance.
 * Provides a method to clone an instance.
 *
 * @example
 * class ExampleState extends State<ExampleState> {
 *      hoge = "hogehoge";
 * }
 *
 * const ex = new ExampleState();
 * // { "hoge": "hogehoge" }
 * const ex2 = ex.clone({ hoge: "blah blah blah" });
 * // { "hoge": "blah blah blah" }
 */
var State = /** @class */ (function () {
    function State() {
    }
    State.prototype.clone = function (args) {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this, args);
    };
    return State;
}());

/**
 * Create a store.
 * @param option store option
 */
function createProvider(option) {
    return new Provider(option);
}

function service() {
    return Injectable();
}

export { Message, Provider, State, Store, action, createProvider, service, store };

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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

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

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var Message = /** @class */ (function () {
    function Message(payload) {
        this.payload = payload;
        this.type = this.constructor.message || this.constructor.name;
    }
    return Message;
}());
var Store = /** @class */ (function () {
    function Store(initialState, mutation) {
        this.observers = [];
        this._state = initialState;
        this.mutation = function (state, message) {
            return mutation(state, message);
        };
    }
    Object.defineProperty(Store.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
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
function action(name) {
    return function (target, name, desc) {
        if (!target.toBindActions) {
            target.toBindActions = new Map();
        }
        console.log(target, name, desc);
        if (target instanceof Store) {
            var func_1 = desc.value;
            desc.value = function () {
                console.log(" -- log --");
                var result = Reflect.apply(func_1, this, arguments);
                return result;
            };
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
            try {
                var store_1 = this._container.get(ctor);
                store_1.subscribe(function (e) {
                    for (var _i = 0, _a = _this.observers; _i < _a.length; _i++) {
                        var observer = _a[_i];
                        observer(e);
                    }
                });
            }
            catch (ex) {
                throw new Error("Failed to create relux provider \"" + ex.message + "\" \n");
            }
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
    try {
        return new Provider(option);
    }
    catch (ex) {
        console.error(ex.message);
        throw new Error(ex.message);
    }
}

var defineStore = function (define) {
    var _a;
    return _a = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super.call(this, define.initialState(), define.mutation) || this;
                var context = {
                    mutate: _this.mutate.bind(_this),
                    getState: function () { return _this.state; }
                };
                // define actions
                var actions = define.actions(context);
                for (var key in actions) {
                    _this[key] = actions[key];
                }
                return _this;
            }
            return class_1;
        }(Store)),
        _a.slice = define.name,
        _a;
};
var defineMessage = function (name) {
    var _a;
    var M = (_a = /** @class */ (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return class_2;
        }(Message)),
        _a.message = name,
        _a);
    return [
        function (payload) { return new M(payload); },
        function (message) { return message instanceof M; },
        function (message) { return message.payload; }
    ];
};

var service = function () {
    return Injectable();
};
var getPayload = function (message) { return message.payload; };

export { Message, Provider, State, Store, action, createProvider, defineMessage, defineStore, getPayload, service, store };

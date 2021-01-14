import 'reflect-metadata';
import { ReflectiveInjector } from 'injection-js';
export { Inject, Injectable } from 'injection-js';

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

var Store = /** @class */ (function () {
    function Store(option) {
        var _a;
        this._observers = [];
        this.slices = [];
        this.actionInfos = {};
        var ctors = [];
        for (var key in option.slices) {
            var slice = option.slices[key];
            this.slices = __spreadArrays(this.slices, [slice]);
            for (var _i = 0, _b = slice.actions; _i < _b.length; _i++) {
                var action = _b[_i];
                ctors.push(action);
                this.actionInfos[action] = { sliceName: slice.name };
                this.state = __assign(__assign({}, this.state), (_a = {}, _a[slice.name] = slice.state, _a));
            }
        }
        if (option.services) {
            for (var _c = 0, _d = option.services; _c < _d.length; _c++) {
                var s = _d[_c];
                ctors.push(s);
            }
        }
        this._container = ReflectiveInjector.resolveAndCreate(ctors);
    }
    Store.prototype.getState = function () {
        return this.state;
    };
    Store.prototype.mutate = function (sliceName, mutation, action) {
        var _a;
        if (action === void 0) { action = "no action"; }
        var old = this.state[sliceName];
        var newState = mutation(old);
        this.state = __assign(__assign({}, this.state), (_a = {}, _a[sliceName] = newState, _a));
        this.invokeObservers(sliceName, newState, action);
    };
    Store.prototype.dispatch = function (ctor, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var action, sliceName, state, feature;
            var _this = this;
            return __generator(this, function (_a) {
                action = this._container.get(ctor);
                sliceName = this.getSliceNameFromAction(ctor);
                state = this.getState()[sliceName];
                if (!state) {
                    throw new Error("Slice \"" + sliceName + "\" is not found.");
                }
                feature = action.invoke(payload);
                feature({
                    dispatch: function (ctor, payload) { return _this.dispatch(ctor, payload); },
                    mutate: function (m) { return _this.mutate(sliceName, m, action.name || ctor.name); },
                    state: state
                });
                return [2 /*return*/];
            });
        });
    };
    Store.prototype.subscribe = function (observer) {
        var _this = this;
        this._observers = __spreadArrays(this._observers, [observer]);
        return {
            dispose: function () {
                _this._observers = _this._observers.filter(function (o) { return o !== observer; });
            }
        };
    };
    Store.prototype.getSliceNameFromAction = function (action) {
        var slice = this.actionInfos[action];
        if (!slice) {
            throw new Error("Action " + action + " is not registerd.");
        }
        return slice.sliceName;
    };
    Store.prototype.invokeObservers = function (slice, state, action) {
        for (var _i = 0, _a = this._observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer({ action: action, state: state, slice: slice });
        }
    };
    return Store;
}());

var Action = /** @class */ (function () {
    function Action() {
    }
    return Action;
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
 * @typedef TRootState RootState type
 */
function createStore(option) {
    var store = new Store(option);
    return store;
}

export { Action, State, Store, createStore };

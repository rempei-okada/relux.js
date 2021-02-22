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
export declare class State<T> {
    clone(args: Partial<T>): T;
}

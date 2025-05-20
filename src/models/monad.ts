type Nothing = undefined | null
type Reduce<TType> = Exclude<TType, Nothing>

export default class Monad<TType> {
    private _value?: TType;

    constructor(value?: TType) {
        this._value = value;
    }

    public static of<TValue>(value: TValue) {
        return new Monad(value);
    }

    public static nothing() {
        return new Monad<Nothing>();
    }

    /**
     *
     * @param callback Callback applied to the inner value.
     * @returns If the inner value is null, an empty Option object is returned. Otherwise returns a new Option object with the callback's result as it's value.
     */
    public map<TResult>(callback: (value: NonNullable<TType>) => TResult): Monad<TResult | Nothing> {
        return this._value != null
            ? Monad.of(callback(this._value))
            : Monad.nothing()
    }

    /**
     *
     * @param value Value used when inner value is nullish.
     * @returns Inner value or the value provided
     */
    public reduce(value: Reduce<TType>) {
        return this._value != null ? this._value : value;
    }

    toString() {
        return String(this._value)
    }
}
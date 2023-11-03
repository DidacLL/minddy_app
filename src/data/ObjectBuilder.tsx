export abstract class ObjectBuilder<T, R> {
    private _id?: string | undefined;
    public get id(): string | undefined {
        return this._id;
    }
    public set id(value: string | undefined) {
        this._id = value;
    }
    tags?: string[];
    isNew?: boolean;

    abstract isFullFilled(): boolean;

    abstract build(): R;

    abstract resetData(object?: T, isNew?: boolean): void;
}
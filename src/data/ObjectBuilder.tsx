export abstract class ObjectBuilder<T, R> {
    id?: string;
    tags?: string[];
    isNew?: boolean;

    abstract isFullFilled(): boolean;

    abstract build(): R;

    abstract resetData(object: T, isNew: boolean): void;
}
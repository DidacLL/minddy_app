export class MinddyObject {
    private _isLoaded: boolean = false;

    get isLoaded(): boolean {
        return this._isLoaded;
    }

    set isLoaded(value: boolean) {
        this._isLoaded = value;
    }

}
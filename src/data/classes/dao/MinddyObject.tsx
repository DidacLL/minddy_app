export class MinddyObject {
    private _isLoaded: boolean = false;
    public id:string;

    constructor(id:string) {
        this.id = id;
    }

    get isLoaded(): boolean {
        return this._isLoaded;
    }

    set isLoaded(value: boolean) {
        this._isLoaded = value;
    }

}
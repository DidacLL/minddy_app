import React from "react";
import {MinddyManager} from "../../Minddy.manager";

export abstract class MinddyObject {
    get tags(): string[] {
        return this._tags;
    }

    set tags(value: string[]) {
        this._tags = value;
        this.isLoaded=true;
    }
    private _isLoaded: boolean = false;
    public id:string;
    private _tags!:string[];
    private _request: any;
    public abstract resetRequest():any
    public abstract save(token:string):any
    public abstract getTitle():string;
    public abstract getTableRow():React.JSX.Element;
    public abstract getTableTitle():React.JSX.Element;
    public abstract getCardBody(manager?:MinddyManager):React.JSX.Element;
    abstract getFullView(manager?:MinddyManager):React.JSX.Element;

    protected constructor(id:string) {
        this.id = id;
        this._request=this.resetRequest()||undefined;
    }

    get isLoaded(): boolean {
        return this._isLoaded;
    }

    set isLoaded(value: boolean) {
        this._isLoaded = value;
    }

    get request(): any {
        return this._request;
    }

    set request(value: any) {
        this._request = value;
    }
}
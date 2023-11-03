import {MinddyObject} from "./MinddyObject";
import React from "react";
import {MinddyManager} from "../../Minddy.manager";
import {TagData} from "./TagData";


export class Tag extends MinddyObject {
    private _isVisble: boolean;
    private _isHeritable: boolean;
    constructor(id: string, isHeritable: boolean, isVisible:boolean) {
        super(id);
        this._isHeritable = isHeritable;
        this._isVisble=isVisible;
    }

    get isVisble(): boolean {
        return this._isVisble;
    }
    set isVisble(value: boolean) {
        this._isVisble = value;
    }
    public getTableRow(): React.JSX.Element {
        throw new Error("Method not implemented.");
    }
    public getTableTitle(): React.JSX.Element {
        throw new Error("Method not implemented.");
    }


    public resetRequest() {
    }
    public save(token: string) {
    }

    static parseTags(json: string): Tag[] {
        const data = JSON.parse(json) as TagData[]
        return data.map(tag=>new Tag(tag.id, tag.isHeritable,tag.isVisible))
    }

    getCardBody(manager?: MinddyManager): React.JSX.Element {
        return <div></div>;
    }

    getFullView(manager?: MinddyManager): React.JSX.Element {
        return <div></div>;
    }

    getTitle(): string {
        return this.id;
    }

}
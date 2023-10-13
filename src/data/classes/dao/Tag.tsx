import {MinddyObject} from "./MinddyObject";
import React from "react";
import {MinddyManager} from "../../Minddy.manager";


export interface TagData{
    id:string;
    heritable:boolean;
}

export class Tag extends MinddyObject {
    public getTableRow(): React.JSX.Element {
        throw new Error("Method not implemented.");
    }
    public getTableTitle(): React.JSX.Element {
        throw new Error("Method not implemented.");
    }
    private _isHeritable: boolean;

    constructor(id: string, isHeritable: boolean) {
        super(id);
        this._isHeritable = isHeritable;
    }

    public resetRequest() {
    }
    public save(token: string) {
    }

    static parseTags(json: string): Tag[] {
        const data = JSON.parse(json) as TagData[]
        return data.map(tag=>new Tag(tag.id, tag.heritable))
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
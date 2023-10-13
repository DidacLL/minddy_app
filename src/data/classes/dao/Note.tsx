import {MinddyObject} from "./MinddyObject";
import {MinddyManager} from "../../Minddy.manager";
import React from "react";
import {NoteRow} from "../../../components/NoteRow";

export enum NoteType {
    TEXT, LINK, SEARCH, NUMBER
}

interface NoteData {
    noteDTO: {
        id: string,
        name: string,
        body: string
        type: number;
        isVisible: boolean;
    }
    tags: { name: string, isVisible: boolean, isHeritable: boolean }[];
}

export class Note extends MinddyObject {
    name: string;
    body: string;
    type: NoteType;

    constructor(id: string, name: string, body: string, type?: NoteType) {
        super(id);
        this.name = name;
        this.body = body;
        this.type = type || NoteType.TEXT;
    }

    static parseNote(json: string): Note {
        let data = JSON.parse(json) as NoteData;
        const dto = data.noteDTO;
        const note = new Note(dto.id, dto.name, dto.body, dto.type);
        note.tags = data.tags.map(t => t.name);
        note.isLoaded = true;
        return note
    }
    getTableRow() {
        return <NoteRow note={this}/>
    }

    getTableTitle(): React.JSX.Element {
        return <thead><tr>
            <th>Note title</th>
            <th>Body</th>
            <th>Tags</th>
        </tr>
        </thead>;
    }


    public resetRequest() {
        return {} as NoteData;
    }

    public save(token: string) {
        throw new Error("Method not implemented.");
    }

    getCardBody(manager?: MinddyManager): React.JSX.Element {
        return <div>
            <label>{this.name}</label>
            <label>{this.body}</label>
            <label>{this.type}</label>
        </div>;
    }

    getFullView(manager?: MinddyManager): React.JSX.Element {

        return <div>
            <label>{this.name}</label>
            <label>{this.body}</label>
            <label>{this.type}</label>
        </div>;
    }

    getTitle(): string {
        return this.name;
    }
}
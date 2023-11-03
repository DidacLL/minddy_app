import {ObjectBuilder} from "./ObjectBuilder";
import {Note, NoteType} from "./classes/dao/Note";
import {NoteRequest} from "./classes/dao/NoteRequest";

export class NoteBuilder extends ObjectBuilder<Note,NoteRequest> {

    private _name: string='';
    private _holder!: string;
    private _body: string = '';
    private _type: NoteType = NoteType.TEXT;
    private _isVisible: boolean=true;
    isFullFilled(): boolean {
        return (this._name !== undefined && this.name.length > 0);
    }
    build(): NoteRequest {
        if (!this.isFullFilled()) throw Error('Task is not full filled')
        return {
            noteDTO: {
                id:this.id||'',
                name:this._name,
                body:this._body,
                type:this._type as number,
                isVisible:this._isVisible
            },
            tags:this.tags||[]
        }
    }
    resetData(note?: Note, isNew?: boolean) {
        this.isNew=isNew;
        if (this.isNew || !note) {
            this.id='';
            this._name='';
            this._body='';
            this._type = NoteType.TEXT;
                this._isVisible=true;

        } else {
            this.id = note.id;
            this._name = note.name;
            this._body= note.body;
            this._isVisible=true
            this.tags = note.tags || [];
        }
        return this;
    }
    //-----------------------------------------------------------------------------------------------------Getters & Setters

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get isVisible(): boolean {
        return this._isVisible;
    }

    set isVisible(value: boolean) {
        this._isVisible = value;
    }
    get type(): NoteType {
        return this._type;
    }

    set type(value: NoteType) {
        this._type = value;
    }
    get body(): string {
        return this._body;
    }

    set body(value: string) {
        this._body = value;
    }



    get holder(): string {
        return this._holder;
    }

    set holder(value: string) {
        this._holder = value;
    }


}
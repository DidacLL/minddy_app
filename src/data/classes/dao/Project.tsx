import {MinddyObject} from "./MinddyObject";
import MinddyService from "../../minddy.service";
import {ProjectMinimalData} from "../dto/ProjectMinimalData";
import {MinddyManager} from "../../Minddy.manager";
import React from "react";
import {Tag} from "./Tag";

export interface ProjectRequest {
    projectData: ProjectData;
    tags: string[];
}
export interface ProjectData{
    holderID:string;
    projectID:string;
    projectName:string;
    description:string;
    state:number;
    deadLine:string;
    uiConfig:string;
}
export enum ProjectState {
    ACTIVE=0,
    DELAYED=1,
    PAUSED=2,
    SILENT=3,
    DISCARDED=4,
    COMPLETE=5
}

export class ProjectConfig {
    //todo
}

export class Project extends MinddyObject {
    save(token: string): any {
    }

    private _name: string;
    private _uiConfig: ProjectConfig;
    private _state: ProjectState;

    private _description: string | undefined;
    private _deadLine: Date | undefined;
    private _numNotes: number | undefined;
    private _pendingTasks: number | undefined;
    constructor(id: string, name: string, uiConfig: ProjectConfig,state: ProjectState, description?: string,  deadLine?: Date, numNotes?: number, pendingTasks?: number) {
        super(id);
        this._name = name;
        this._uiConfig = uiConfig;
        this._description = description;
        this._state = state;
        this._deadLine = deadLine;
        this._numNotes = numNotes;
        this._pendingTasks = pendingTasks;
    }
//--------------------------------------------------------------------------------------------------------------GETTERS
    get name(): string {
        return this._name;
    }
    get uiConfig(): ProjectConfig {
        return this._uiConfig;
    }

    resetRequest(): any {
        this.request= {projectData:this.getProjectData() as ProjectData,tags:this.tags||[]}
    }

    get description(): string | undefined {
        return this._description;
    }

    get state(): ProjectState {
        return this._state;
    }

    get pendingTasks(): number | undefined {
        return this._pendingTasks;
    }

    get deadLine(): Date | undefined {
        return this._deadLine;
    }

    get numNotes(): number | undefined {
        return this._numNotes;
    }
//--------------------------------------------------------------------------------------------------------------SETTERS
    set name(value: string) {
        this._name = value;
    }

    set state(value: ProjectState) {
        this._state = value;
    }

    set description(value: string | undefined) {
        this._description = value;
    }

    set uiConfig(value: ProjectConfig) {
        this._uiConfig = value;
    }

    set deadLine(value: Date | undefined) {
        this._deadLine = value;
    }

    set numNotes(value: number | undefined) {
        this._numNotes = value;
    }

    set pendingTasks(value: number | undefined) {
        this._pendingTasks = value;
    }
    //------------------------------------------------------------------------------------------------------------STATIC
    static parseProjectMinimal(data: ProjectMinimalData): Project {
        let id = data.ownerID + data.projectID as string;
        let name = data.projectName as string;
        let uiConfig = data.uiConfig as ProjectConfig;
        let state = data.state as ProjectState;
        return new Project(id, name, uiConfig, state, undefined, undefined, data.notes, data.pendingTasks);
    }

    private loadFullProject(json: string): void {
        let data = JSON.parse(json) as ProjectData;
        this._description = data.description as string;
        if (!this._state) this._state = data.state as ProjectState;
        if (!this._deadLine && (data.deadLine)&&(data.deadLine as string).length>1) this._deadLine = new Date(data.deadLine as string); //FIXME


    }

    getParentID(): string {
        return this.id.slice(0, this.id.length - 2);
    }

    getOwnID() {
        return this.id.slice(this.id.length - 2);
    }

    getProjectData():ProjectData{
        return {
            holderID:this.id.slice(0, this.id.length - 2),
            projectID: this.id.slice(this.id.length - 2),
            projectName: this._name,
            description:this._description||'',
            state:this._state,
            deadLine:this._deadLine?.toLocaleDateString()||'',
            uiConfig:JSON.stringify(this.uiConfig)||''
        }
    }
    getMinimalData(): ProjectMinimalData {
        return {
            ownerID: this.id.slice(0, this.id.length - 2),
            projectID: this.id.slice(this.id.length - 2),
            projectName: this._name,
            uiConfig: this._uiConfig,
            notes: this._numNotes,
            pendingTasks: this._pendingTasks,
            state:this._state
        } as ProjectMinimalData
    }

    getAllProjectsPath(): string[] {
        const retVal: string[] = []
        let end = 2;
        for (let i = 0; i < Math.ceil(this.id.length / 2); i++) {
            retVal.push(this.id.slice(0, end))
            end = Math.min(end + 2, this.id.length);
        }
        return retVal
    }

    load(token: string, back?: () => any) : boolean {
        if (!this.isLoaded) {
            MinddyService.getFullProject(token, this.id,
                (response) => {
                    if (response){
                        this.loadFullProject(response)
                        MinddyService.getProjectTags(token,this.id,
                            json=> {
                                this.tags=Tag.parseTags(json).map(e=>e.id);
                                this.isLoaded = true;
                                back?.();
                            },
                            (e)=>{})
                    }},
                ()=>{this.isLoaded=false;}
                )


            return false;
        }
        back?.();
        return  this.isLoaded;
    }
    getFullView(manager?: MinddyManager): React.JSX.Element {
        return <></>;
    }
    getTitle(): string {
        return this._name;
    }

    getCardBody():any{
        return <div>{this._deadLine?.toLocaleDateString()||'' + this._description + this._state}</div>
    }
    //
    // getPendingTasks(token:string, callBack:(json:any)=>void,error:(message:string)=>void,size:number,page:number) {
    //     MinddyService.loadProjectDashboardTasks(token,this.id,callBack,error,size,page)
    // }
    isRootProject(){
        return this.id.length<=2;
    }

    getTableRow(): React.JSX.Element {
        return <></>;
    }

    getTableTitle(): React.JSX.Element {
        return <></>;
    }


}

import {ProjectMinimalData} from "../ProjectStructure";
import {MinddyObject} from "./MinddyObject";
import MinddyService from "../../minddy.service";

interface ProjectData{
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
    id: string;
    name: string;
    uiConfig: ProjectConfig;
    state: ProjectState;
    description: string | undefined;
    deadLine: Date | undefined;
    numNotes: number | undefined;
    pendingTasks: number | undefined;

    constructor(id: string, name: string, uiConfig: ProjectConfig,state: ProjectState, description?: string,  deadLine?: Date, numNotes?: number, pendingTasks?: number) {
        super();
        this.id = id;
        this.name = name;
        this.uiConfig = uiConfig;
        this.description = description;
        this.state = state;
        this.deadLine = deadLine;
        this.numNotes = numNotes;
        this.pendingTasks = pendingTasks;
    }
    static parseProjectMinimal(data: ProjectMinimalData): Project {
        let id = data.ownerID + data.projectID as string;
        let name = data.projectName as string;
        let uiConfig = data.uiConfig as ProjectConfig;
        let state = data.state as ProjectState;
        return new Project(id, name, uiConfig, state, undefined, undefined, data.notes, data.pendingTasks);
    }

    private loadFullProject(json: string): void {
        let data = JSON.parse(json) as ProjectData;
        this.description = data.description as string;
        if (!this.state) this.state = data.state as ProjectState;
        if (!this.deadLine && (data.deadLine)&&(data.deadLine as string).length>1) this.deadLine = new Date(data.deadLine as string); //FIXME
        this.isLoaded = true;

    }

    getParentID(): string {
        return this.id.slice(0, this.id.length - 2);
    }

    getOwnID() {
        return this.id.slice(this.id.length - 2);
    }

    getMinimalData(): ProjectMinimalData {
        return {
            ownerID: this.id.slice(0, this.id.length - 2),
            projectID: this.id.slice(this.id.length - 2),
            projectName: this.name,
            uiConfig: this.uiConfig,
            notes: this.numNotes,
            pendingTasks: this.pendingTasks,
            state:this.state
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
        console.log("Start loading project")
        if (!this.isLoaded) {
            MinddyService.getFullProject(token, this.id,
                (response) => {
                    if (response){
                        this.loadFullProject(response)
                        back?.()
                    }},
                ()=>{this.isLoaded=false;}
                )
            return false;
        }
        back?.();
        return  this.isLoaded;
    }

    getPendingTasks(token:string, callBack:(json:any)=>void,error:(message:string)=>void,size:number,page:number) {
        MinddyService.loadProjectDashboardTasks(token,this.id,callBack,error,size,page)
    }
    getAllTasks(token:string,callBack:(json:any)=>void,size:number,page:number, viewAll:boolean,subprojects:boolean,error:(message:string)=>void) {
        MinddyService.loadAllTasks(token,this.id,size,page,viewAll,subprojects,callBack,error)
    }

    isRootProject(){
        return this.id.length<=2;
    }
}

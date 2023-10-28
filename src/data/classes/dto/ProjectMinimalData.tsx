import {ProjectState} from "../../enums/ProjectState";

export interface ProjectMinimalData {
    ownerID: string;
    projectID: string;
    projectName: string;
    notes: number;
    pendingTasks: number;
    uiConfig: string;
    state: ProjectState;
}
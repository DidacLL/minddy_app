import {ProjectMinimalData} from "./ProjectMinimalData";

export interface ProjectNodeData {
    project: ProjectMinimalData;
    subProjects: ProjectNodeData[];
    accumulatedSubprojects: number;
}
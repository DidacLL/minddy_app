import {Project} from "../dao/Project";
import {ProjectNodeData} from "./ProjectNodeData";

export class ProjectNode {
    project: Project;
    subProjects: ProjectNode[];
    accumulatedSubprojects: number;

    constructor(
        project: Project,
        subProjects: ProjectNode[],
        accumulatedSubprojects: number
    ) {
        this.project = project;
        this.subProjects = subProjects;
        this.accumulatedSubprojects = accumulatedSubprojects;
    }

    getImmediateSubProjects() {
        return this.subProjects.map((x) => x.project);
    }

    getProjectData(){
        return this.project.getProjectData()
    }
    static parseProjectNode(data: ProjectNodeData): ProjectNode {
        const project = Project.parseProjectMinimal(data.project);
        const subProjects = data.subProjects.map(subProject => ProjectNode.parseProjectNode(subProject));
        return new ProjectNode(project, subProjects, data.accumulatedSubprojects);
    }

    isRootProject() {
        return this.project.id.length<=2;
    }

    hasChild() {
        return this.subProjects && this.subProjects.length>0;
    }
}
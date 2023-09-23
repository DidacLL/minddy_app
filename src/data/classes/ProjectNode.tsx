import {ProjectNodeData} from "./ProjectStructure";
import {Project} from "./bussiness/Project";

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
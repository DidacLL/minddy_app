import {ProjectNode} from "./ProjectNode";
import {ProjectState} from "./bussiness/Project";

export interface ProjectMinimalData {
    ownerID: string;
    projectID: string;
    projectName: string;
    notes: number;
    pendingTasks: number;
    uiConfig: string;
    state: ProjectState;
}

export interface ProjectNodeData {
    project: ProjectMinimalData;
    subProjects: ProjectNodeData[];
    accumulatedSubprojects: number;
}

interface ProjectStructureData {
    date: string;
    root: ProjectNodeData;
}

export class ProjectStructure {
    date: Date;
    root: ProjectNode;
    nodeMap: Map<string, ProjectNode>;

    constructor(date: Date, root: ProjectNode) {
        this.date = date;
        this.root = root;
        this.nodeMap = new Map();
        this.buildNodeMap(root);
    }

    buildNodeMap(node: ProjectNode) {
        this.nodeMap.set(node.project.id, node);
        node.subProjects.forEach(subProject => this.buildNodeMap(subProject));
    }

    getNodeById(projectID: string) {
        return this.nodeMap.get(projectID);
    }

    static parseProjectStructure(jsonStructure: string): ProjectStructure {
        const data = JSON.parse(jsonStructure) as ProjectStructureData;
        const root = ProjectNode.parseProjectNode(data.root);
        return new ProjectStructure(new Date(data.date), root);
    }
}


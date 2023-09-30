import {ProjectNode} from "../dto/ProjectNode";
import {ProjectStructureData} from "../dto/ProjectStructureData";

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


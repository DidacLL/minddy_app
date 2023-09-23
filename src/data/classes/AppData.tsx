import {ProjectStructure} from "./ProjectStructure";
import ScreenData from "./ScreenData";
import MinddyService from "../minddy.service";
import {MinddyUser} from "./bussiness/MinddyUser";
import {Project} from "./bussiness/Project";
import {DashboardTab} from "../../pages/MainScreen";

export class AppData {
    user: MinddyUser
    screen: ScreenData
    structure!: ProjectStructure
    currentProject!: Project
    logout:()=>any
    minimizeProjectTree!: () => void;
    updateProjectButton!: (b: boolean) => void;
    changeDashboard!: (p: Project) => void;
    updateTree!: (project: Project) => void;
    changeDashboardTab!: (tab: DashboardTab) => void;
    updateToolbar!: () => void;

    constructor(user: MinddyUser, screen: ScreenData,onLoad:()=>void,logout:()=>any) {
        this.user = user;
        this.screen = screen;
        MinddyService.loadProjectStructure(user.token,(x)=>this.structure=x).then(()=>{
            this.changeCurrentProject(this.structure.root.project)
            onLoad();
        })
        this.logout=logout;

    }
    changeCurrentProject(project: Project) {
        this.currentProject=project;
        this.updateTree(project);
        project.load(this.user.token,()=> {
            this.updateToolbar();
            this.changeDashboard(project);
        });

        return this.currentProject;
    }

    newProject(parent: string) {

    }

    newTask(holder: string) {

    }

    newNote(holder: string) {
    }

    editProject(id: string) {

    }

    editTask(id: string) {

    }

    editNote(id: string) {
    }

    searchProject(keyword: string) {

    }

}
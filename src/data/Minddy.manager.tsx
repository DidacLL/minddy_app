import {ProjectStructure} from "./classes/ProjectStructure";
import ScreenData from "./classes/ScreenData";
import MinddyService from "./minddy.service";
import {MinddyUser} from "./classes/bussiness/MinddyUser";
import {Project} from "./classes/bussiness/Project";
import {DashboardTab} from "../pages/MainScreen";
import Task, {TaskMinimal} from "./classes/bussiness/Task";

export class MinddyManager {
    user: MinddyUser
    screen: ScreenData
    private readonly _logout: () => any
    private _taskPool: Map<string, Task> = new Map();

    constructor(user: MinddyUser, screen: ScreenData, callBack: () => void, error: () => void, logout: () => any) {
        MinddyService.loadProjectStructure(user.token, (x) => {
            this._structure = x;
            this.changeCurrentProject(this._structure?.root.project);
            callBack();
        }, error)
        //     .then(() => {
        //     this.changeCurrentProject(this._structure?.root.project)
        //     callBack();
        // }).catch(() => error())
        this.user = user;
        this.screen = screen;
        this._logout = logout;

    }

    private _structure!: ProjectStructure

    get structure(): ProjectStructure {
        if (!this._structure) throw new Error("Structure not load")
        return this._structure;
    }

    private _currentProject!: Project

    get currentProject(): Project {
        if (!this._currentProject) throw new Error("There is not any Project as Current")
        return this._currentProject;
    }

    private _minimizeProjectTree!: () => void;

    get minimizeProjectTree(): () => void {
        if (!this._minimizeProjectTree) throw new Error("Function not ready")
        return this._minimizeProjectTree;
    }

    set minimizeProjectTree(value: () => void) {
        if (value) this._minimizeProjectTree = value;
    }

    private _updateProjectButton!: (b: boolean) => void;

    get updateProjectButton(): (b: boolean) => void {
        if (!this._updateProjectButton) throw new Error("Function not ready")
        return this._updateProjectButton;
    }

    set updateProjectButton(value: (b: boolean) => void) {
        if (value) this._updateProjectButton = value;
    }

    private _changeDashboard!: (p: Project) => void;

    set changeDashboard(value: (p: Project) => void) {
        if (value) this._changeDashboard = value;
    }

    private _updateTree!: (project: Project) => void;

    set updateTree(value: (project: Project) => void) {
        if (value) this._updateTree = value;
    }

    private _changeDashboardTab!: (tab: DashboardTab) => void;

    get changeDashboardTab(): (tab: DashboardTab) => void {
        if (!this._changeDashboard) throw new Error("Function not ready")
        return this._changeDashboardTab;
    }

    set changeDashboardTab(value: (tab: DashboardTab) => void) {
        if (value) this._changeDashboardTab = value;
    }

    private _updateToolbar!: () => void;

    get updateToolbar(): () => void {
        if (!this._updateToolbar) throw new Error("Function not ready")
        return this._updateToolbar;
    }


    //--------------------------------------------getters and setters

    set updateToolbar(value: () => void) {
        if (value) this._updateToolbar = value;
    }

    get logout(): () => any {
        if (!this._logout) throw new Error("Function not ready")
        return this._logout;
    }

    changeCurrentProject(project: Project) {
        try {
            this._currentProject = project;
            this._updateTree(project);
            project.load(this.user.token, () => {
                this._updateToolbar();
                this._changeDashboard(project);
            });

        } catch (e) {
            console.log('error from manager-48: ' + e)
        }

        return this._currentProject;
    }

    addToTasks(task: Task) {
        this._taskPool.set(task.id, task)
    }

    loadTask(taskId: string) {
        const val = this._taskPool.get(taskId)
        if (val) return true
        MinddyService.getFullTask(this.user.token, taskId, v => this.addToTasks(Task.parseTask(v)), v => {
        })
        return false;
    }

    getTask(taskId: string) {
        const val = this._taskPool.get(taskId)
        if (val) return val
        MinddyService.getFullTask(this.user.token, taskId, v => this.addToTasks(Task.parseTask(v)), v => {
        })
        return null;
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
import {ProjectStructure} from "./classes/utils/ProjectStructure";
import ScreenData from "./classes/utils/ScreenData";
import MinddyService from "./minddy.service";
import {MinddyUser} from "./classes/dao/MinddyUser";
import {Project} from "./classes/dao/Project";
import Task from "./classes/dao/Task";
import {MinddyPool} from "./classes/utils/MinddyPool";
import {PagedResponse} from "./classes/dto/PagedResponse";
import {ObjectMinimal} from "./classes/dto/ObjectMinimal";
import {DashboardTabs} from "./enums/DashboardTabs";

export class MinddyManager {
    user: MinddyUser
    screen: ScreenData
    private readonly _logout: () => any
    private _taskPool: MinddyPool<Task>;
    private _structure!: ProjectStructure
    private _currentTaskPage!: PagedResponse<ObjectMinimal>;

    private _currentProject!: Project

    private _updateToolbar!: () => void;


    private _minimizeProjectTree!: () => void;

    private _updateProjectButton!: (b: boolean) => void;

    private _changeDashboard!: (p: Project) => void;


    private _updateTree!: (project: Project) => void;

    private _changeDashboardTab!: (tab: DashboardTabs) => void;

    constructor(user: MinddyUser, screen: ScreenData, callBack: () => void, error: () => void, logout: () => any) {
        MinddyService.loadProjectStructure(user.token, (structure) => {
            this._structure = structure;
            this.changeCurrentProject(this._structure?.root.project);
            callBack();
        }, error)
        this.user = user;
        this.screen = screen;
        this._logout = logout;
        this._taskPool = new MinddyPool<Task>(
            (id, callback1, error1) => {
                MinddyService.getFullTask(
                    this.user.token,
                    id,
                    callback1,
                    error1
                )
            },
            (json) => Task.parseTask(json)
        )

        const savedTaskPool= localStorage.getItem(Date.now().toLocaleString()+'_'+typeof Task)
        if(savedTaskPool)this._taskPool.addElements((JSON.parse(savedTaskPool) as Task[]))

    }

    get currentProject(): Project {
        if (!this._currentProject) throw new Error("There is not any Project as Current")
        return this._currentProject;
    }
    get updateToolbar(): () => void {
        if (!this._updateToolbar) throw new Error("Function not ready")
        return this._updateToolbar;
    }

    set updateToolbar(value: () => void) {
        if (value) this._updateToolbar = value;
    }

    get minimizeProjectTree(): () => void {
        if (!this._minimizeProjectTree) throw new Error("Function not ready")
        return this._minimizeProjectTree;
    }

    set minimizeProjectTree(value: () => void) {
        if (value) this._minimizeProjectTree = value;
    }

    get updateProjectButton(): (b: boolean) => void {
        if (!this._updateProjectButton) throw new Error("Function not ready")
        return this._updateProjectButton;
    }

    set updateProjectButton(value: (b: boolean) => void) {
        if (value) this._updateProjectButton = value;
    }

//-------------------------------------------------------------GETTERS & SETTERS
    set changeDashboard(value: (p: Project) => void) {
        if (value) this._changeDashboard = value;
    }

    set updateTree(value: (project: Project) => void) {
        if (value) this._updateTree = value;
    }

    get changeDashboardTab(): (tab: DashboardTabs) => void {
        if (!this._changeDashboard) throw new Error("Function not ready")
        return this._changeDashboardTab;
    }

    set changeDashboardTab(value: (tab: DashboardTabs) => void) {
        if (value) this._changeDashboardTab = value;
    }

    get logout(): () => any {
        if (!this._logout) throw new Error("Function not ready")
        return this._logout;
    }

//----------------------------------------------------------------PUBLIC METHODS
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

    getProjectToDoPage(callBack: (page: PagedResponse<ObjectMinimal>) => any, error: (e: any) => any, size?: number, page?: number) {
            console.log("Loading project todo (manager-150)")
            MinddyService.loadProjectDashboardTasks(
                this.user.token,
                this._currentProject.id,
                (v) => {
                    const val = JSON.parse(v) as PagedResponse<ObjectMinimal>
                    val.content.map((value) => {
                        this.getTask(value.id,
                            (task) => {


                            },
                            error);
                    })
                    this._currentTaskPage = val;
                    callBack(val);
                },
                error,
                size,
                page)
    }

    getTask(id: string, callback: (task: Task) => any, error: (e: any) => any) {
        this._taskPool.get(id, callback, error);
    }

    getProject(id: string) {
        return this._structure.nodeMap.get(id)?.project;
    }

    getProjectNode(id: string) {
        return this._structure.nodeMap.get(id);
    }

    getRootProjectNode() {
        return this._structure.root;
    }

    getRootProject() {
        return this._structure.root.project;
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
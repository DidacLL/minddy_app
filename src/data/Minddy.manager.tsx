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
import React from "react";
import {Note} from "./classes/dao/Note";
import {Tag} from "./classes/dao/Tag";
import {TaskData} from "./classes/dto/TaskData";

export class MinddyManager {
    user: MinddyUser
    screen: ScreenData
    isTouchScreen:boolean
    private readonly _logout: () => any
    private _taskPool: MinddyPool<Task>;
    private _notePool: MinddyPool<Note>;
    private _structure!: ProjectStructure
    private _currentTaskPage!: PagedResponse<ObjectMinimal>;
    private _currentProject!: Project
    private _tags:string[]=[];
    openModal!: (body: React.JSX.Element) => void;
    private _updateToolbar!: () => void;
    private _minimizeProjectTree!: () => void;

    private _updateProjectButton!: (b: boolean) => void;

    private _changeDashboard!: (p: Project) => void;


    private _updateTree!: (project: Project) => void;

    private _changeDashboardTab!: (tab: DashboardTabs) => void;

    private _updateScroller!: () => void;


    constructor(user: MinddyUser, screen: ScreenData, callBack: () => void, error: () => void, logout: () => any, isTouchScreen?:boolean) {
        MinddyService.loadProjectStructure(user.token, (structure) => {
            this._structure = structure;
            this.changeCurrentProject(this._structure?.root.project);
            callBack();
        }, error)
        this.isTouchScreen= isTouchScreen||false;
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
        this._notePool = new MinddyPool<Note>(
            (id, callback1, error1) => {
                MinddyService.getFullNote(
                    this.user.token,
                    id,
                    callback1,
                    error1
                )
            },
            (json) => Note.parseNote(json)
        )
        MinddyService.getUserTags(this.user.token,(json)=>{
            this._tags=JSON.parse(json) as string[];
        },(e)=>{})

        const savedTaskPool= localStorage.getItem(Date.now().toLocaleString()+'_'+typeof Task)
        if(savedTaskPool)this._taskPool.addElements((JSON.parse(savedTaskPool) as Task[]))
        const savedNotePool= localStorage.getItem(Date.now().toLocaleString()+'_'+typeof Note)
        if(savedNotePool)this._notePool.addElements((JSON.parse(savedNotePool) as Note[]))

    }

//-------------------------------------------------------------GETTERS & SETTERS
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


    get tags():string[]{
        return this._tags;
    }
    tagExists(name:string):boolean{
        return this._tags.includes(name);
    }
    addTag(name:string):boolean{
    // todo
        return this._tags.includes(name);
    }
    set updateScroller(value: () => void) {
        this._updateScroller = value;
    }

//----------------------------------------------------------------PUBLIC METHODS
    changeCurrentProject(project: Project) {
        try {
            this._currentProject = project;
            project.load(this.user.token, () => {
                this._updateToolbar();
                this._changeDashboard(project);
            });
            if(!project.tags || project.tags.length>=0)MinddyService.getProjectTags(this.user.token,project.id,(json)=>{
                project.tags=Tag.parseTags(json).map(e=>e.id);
            },(e)=>{})
            this._updateTree(project);
        } catch (e) {
            console.log('error from manager-48: ' + e)
        }

        return this._currentProject;
    }

    getProjectToDoPage(callBack: (page: PagedResponse<ObjectMinimal>) => any, error: (e: any) => any, size: number, page: number) {
            MinddyService.loadProjectDashboardTasks(
                this.user.token,
                this._currentProject.id,
                (v) => {
                    const val = JSON.parse(v) as PagedResponse<ObjectMinimal>
                    val.content.map((value) => {
                        this.getTask(value.id,
                            (task) => {
                                MinddyService.getTaskTags(this.user.token,task.id,(json)=>{
                                    task.tags=Tag.parseTags(json).map(t=>t.id)
                                },(e)=>{})
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
    getProjectNotes(callBack: (page: PagedResponse<ObjectMinimal>) => any, error: (e: any) => any, size: number, page: number) {
            MinddyService.loadProjectNotes(
                this.user.token,
                this._currentProject.id,size,page,
                (v) => {
                    const val = JSON.parse(v) as PagedResponse<ObjectMinimal>
                    val.content.map((value) => {
                        this.getNote(value.id,
                            (note) => {

                            },
                            error);
                    })
                    this._currentTaskPage = val;
                    callBack(val);
                },
                error)
    }

    getTask(id: string, callback: (task: Task) => any, error: (e: any) => any) {
        this._taskPool.get(id, callback, error);
    }

    getNote(id: string, calback: (note: Note) => void, error: (e: any) => any) {
        this._notePool.get(id,calback,error);

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

    getCurrentProjectTasks(callback: (v:PagedResponse<Task>)=>void, error:(e:any)=>void, size: number, page: number,viewAll:boolean,subProjects:boolean) {
        MinddyService.loadAllTasks(this.user.token,
            this._currentProject.id,
            size || 10,
            page || 0,
            viewAll,
            subProjects,
            (json: string) => {
                let data=JSON.parse(json) as PagedResponse<TaskData>;
                callback(Task.parseTaskPage(data));

            },
            error)

    }
}
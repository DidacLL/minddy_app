import {ProjectStructure} from "./classes/utils/ProjectStructure";
import ScreenData from "./classes/utils/ScreenData";
import MinddyService, {MinddyError} from "./minddy.service";
import {MinddyUser} from "./classes/dao/MinddyUser";
import Task, {TaskRequest} from "./classes/dao/Task";
import {MinddyPool} from "./classes/utils/MinddyPool";
import {PagedResponse} from "./classes/dto/PagedResponse";
import {ObjectMinimal} from "./classes/dto/ObjectMinimal";
import React from "react";
import {Note} from "./classes/dao/Note";
import {Tag} from "./classes/dao/Tag";
import {TaskData} from "./classes/dto/TaskData";
import Cookies from "js-cookie";
import {ProjectBuilder} from "./ProjectBuilder";
import {ProjectData, ProjectRequest} from "./classes/dao/Project";
import {TaskBuilder} from "./TaskBuilder";
import {NoteRequest} from "./classes/dao/NoteRequest";
import {NoteBuilder} from "./NoteBuilder";

export class MinddyManager {
    user: MinddyUser
    screen: ScreenData
    isTouchScreen: boolean
    openModal!: (body: React.JSX.Element) => void;
    // private _changeDashboard!: (p: Project) => void;
    public navigate!: (url: string) => void;
    projectBuilder: ProjectBuilder;
    taskBuilder: TaskBuilder;
    disableProjectTreePanel!: (disable: boolean) => void;
    private readonly _logout: () => any
    private _taskPool: MinddyPool<Task>;
    private _notePool: MinddyPool<Note>;
    private _structure!: ProjectStructure
    noteBuilder: NoteBuilder;

    constructor(user: MinddyUser, screen: ScreenData, callBack: () => void, error: () => void, logout: () => any, isTouchScreen?: boolean) {
        MinddyService.loadProjectStructure(user.token, (structure) => {
            this._structure = structure;
            // this.changeCurrentProject(context?context():this.getRootProject().id);
            callBack();
        }, error)
        this.projectBuilder = new ProjectBuilder();
        this.taskBuilder = new TaskBuilder();
        this.noteBuilder = new NoteBuilder();
        this.isTouchScreen = isTouchScreen || false;
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
        MinddyService.getUserTags(this.user.token, (json) => {
            this._tags = JSON.parse(json) as string[];
        }, (e) => {
        })

        const savedTaskPool = localStorage.getItem(Date.now().toLocaleString() + '_' + typeof Task)
        if (savedTaskPool) this._taskPool.addElements((JSON.parse(savedTaskPool) as Task[]))
        const savedNotePool = localStorage.getItem(Date.now().toLocaleString() + '_' + typeof Note)
        if (savedNotePool) this._notePool.addElements((JSON.parse(savedNotePool) as Note[]))

    }

    private _tags: string[] = [];

    get tags(): string[] {
        return this._tags;
    }

    // private _updateTree!: (project: Project) => void;

    // private _changeDashboardTab!: (tab: DashboardTabs) => void;

    // private _updateToolbar!: () => void;
    private _toggleProjectTree!: () => void;

//-------------------------------------------------------------GETTERS & SETTERS

    get toggleProjectTree(): () => void {
        if (!this._toggleProjectTree) throw new Error("Function not ready")
        return this._toggleProjectTree;
    }

    set toggleProjectTree(value: () => void) {
        if (value) this._toggleProjectTree = value;
    }

    private _updateProjectButton!: (b: boolean) => void;

    get updateProjectButton(): (b: boolean) => void {
        if (!this._updateProjectButton) throw new Error("Function not ready")
        return this._updateProjectButton;
    }

    set updateProjectButton(value: (b: boolean) => void) {
        if (value) this._updateProjectButton = value;
    }

    get logout(): () => any {
        Cookies.remove('_m');
        if (!this._logout) throw new Error("Function not ready")
        return this._logout;
    }

    tagExists(name: string): boolean {
        return this._tags.includes(name);
    }

    addTag(name: string): boolean {
        // todo
        return this._tags.includes(name);
    }

    // set updateScroller(value: () => void) {
    //     this._updateScroller = value;
    // }

//----------------------------------------------------------------PUBLIC METHODS


    getProjectToDoPage(id: string, callBack: (page: PagedResponse<ObjectMinimal>) => any, error: (e: any) => any, size: number, page: number) {
        MinddyService.loadProjectDashboardTasks(
            this.user.token,
            id,
            (v) => {
                console.log('Project TODO :')
                console.log(v)
                const val = JSON.parse(v) as PagedResponse<ObjectMinimal>
                val.content.map((value) => {
                    this.getTask(value.id,
                        (task) => {
                            MinddyService.getTaskTags(this.user.token, task.id, (json) => {
                                task.tags = Tag.parseTags(json).map(t => t.id)
                            }, (e) => {
                            })
                        },
                        error);
                })
                callBack(val);
            },
            error,
            size,
            page)
    }

    getProjectNotes(id: string, callBack: (page: PagedResponse<ObjectMinimal>) => any, error: (e: any) => any, size: number, page: number) {
        MinddyService.loadProjectNotes(
            this.user.token,
            id, size, page,
            (v) => {
                const val = JSON.parse(v) as PagedResponse<ObjectMinimal>
                val.content.map((value) => {
                    this.getNote(value.id,
                        (note) => {

                        },
                        error);
                })
                callBack(val);
            },
            error)
    }

    getTask(id: string, callback: (task: Task) => any, error: (e: any) => any) {
        this._taskPool.get(id, callback, error);
    }

    getNote(id: string, calback: (note: Note) => void, error: (e: any) => any) {
        this._notePool.get(id, calback, error);

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

    newProject(data: ProjectRequest, callback?: (response: ProjectData) => any) {
        MinddyService.createNewProject(this.user.token, data, (json) => {
                // sessionStorage.clear()
                try {
                    let data = JSON.parse(json) as ProjectData;
                    MinddyService.loadProjectStructure(
                        this.user.token,
                        (structure) => this._structure = structure
                        , () => {
                        }
                    )
                    callback?.(data);
                    this.projectBuilder = new ProjectBuilder();
                } catch (e) {
                    console.log(JSON.parse(json) as MinddyError)
                }
            },
            (e) => console.log(e.message))
    }

    newTask(data: TaskRequest, callback?: (response: TaskData) => any) {
        MinddyService.createNewTask(this.user.token, data, (json) => {
                // sessionStorage.clear()
                try {
                    let data = JSON.parse(json) as TaskData;
                    MinddyService.loadProjectStructure(
                        this.user.token,
                        (structure) => this._structure = structure
                        , () => {
                        }
                    )
                    callback?.(data);
                    this.taskBuilder = new TaskBuilder();
                } catch (e) {
                    console.log(JSON.parse(json) as MinddyError)
                }
            },
            (e) => console.log(e.message))
    }

    newNote(data: NoteRequest, callback?: (response: NoteRequest) => any) {
        MinddyService.createNewNote(this.user.token, data, (json) => {
                // sessionStorage.clear()
                try {
                    let data = JSON.parse(json) as NoteRequest;
                    MinddyService.loadProjectStructure(
                        this.user.token,
                        (structure) => this._structure = structure
                        , () => {
                        }
                    )
                    callback?.(data);
                    this.noteBuilder = new NoteBuilder();
                } catch (e) {
                    console.log(JSON.parse(json) as MinddyError)
                }
            },
            (e) => console.log(e.message))
    }


    updateProject(data: ProjectRequest, callback?: (response: ProjectData) => any) {
        MinddyService.updateProject(this.user.token, data, (json) => {
            // sessionStorage.clear()
            MinddyService.loadProjectStructure(this.user.token, (structure) => {
                this._structure = structure;
            }, () => {
            })
            let data = JSON.parse(json) as ProjectData;
            callback?.(data)

            this.projectBuilder = new ProjectBuilder();
        })
    }
    updateTask(data: TaskRequest, callback?: (response: TaskData) => any) {
        MinddyService.updateTask(this.user.token, data, (json) => {
            // sessionStorage.clear()
            MinddyService.loadProjectStructure(this.user.token, (structure) => {
                this._structure = structure;
            }, () => {
            })
            let data = JSON.parse(json) as TaskData;
            callback?.(data)

            this.taskBuilder = new TaskBuilder();
        })
    }

    editTask(id: string) {

    }

    editNote(id: string) {
    }

    searchProject(keyword: string) {

    }

    getProjectTasks(id: string, callback: (v: PagedResponse<Task>) => void, error: (e: any) => void, size: number, page: number, viewAll: boolean, subProjects: boolean) {
        MinddyService.loadAllTasks(this.user.token,
            id,
            size || 10,
            page || 0,
            viewAll,
            subProjects,
            (json: string) => {
                let data = JSON.parse(json) as PagedResponse<TaskData>;
                callback(Task.parseTaskPage(data));

            },
            error)

    }

    updateAllData(callBack?: (response: any) => any, error?: (err: any) => any) {
        sessionStorage.clear()
        localStorage.clear()
        MinddyService.loadProjectStructure(this.user.token, (structure) => {
            this._structure = structure;
            // this.changeCurrentProject(context?context():this.getRootProject().id);
            callBack?.(structure);
        }, error ? error : e => {
        })
        this.projectBuilder = new ProjectBuilder();
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
        MinddyService.getUserTags(this.user.token, (json) => {
            this._tags = JSON.parse(json) as string[];
        }, (e) => {
        })
    }

    updateNote(data: NoteRequest, callback?: (response: NoteRequest) => any) {
        MinddyService.updateNote(this.user.token, data, (json) => {
            // sessionStorage.clear()
            MinddyService.loadProjectStructure(this.user.token, (structure) => {
                this._structure = structure;
            }, () => {
            })
            let data = JSON.parse(json) as NoteRequest;
            callback?.(data)

            this.noteBuilder = new NoteBuilder();
        })
    }
}
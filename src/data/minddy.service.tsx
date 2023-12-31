import {ProjectStructure} from "./classes/utils/ProjectStructure";
import {UserData} from "./classes/dto/UserData";
import {ProjectRequest} from "./classes/dao/Project";
import {TaskRequest} from "./classes/dao/Task";
import {NoteRequest} from "./classes/dao/NoteRequest";

export interface MinddyError {
    code: number;
    message: string;
}

export default class MinddyService {

    static API_URL = 'http://localhost:8833/v1/auth/'
    static pendingRequests: Map<string, Promise<any>> = new Map();

    static updateFactor(name: string) {
        return `${name}_${Math.ceil(Date.now() / 100000000)}`;
    }

    static async ping() {
        try {
            const url = this.API_URL.concat('user/demo/ping?ping=ping');
            const request = this.pendingRequests.get(url);
            if (request) return request;
            const fetchPromise = this.pingCall(url)
                .finally(() => {
                    // Once the request is completed, quit the request from pending map
                    this.pendingRequests.delete(url);
                });
            //And save the Request as pending request
            this.pendingRequests.set(url, fetchPromise);
            return await fetchPromise;
        } catch (e) {
            throw new Error(`Server Down :(`);
        }
    }

    static loadUserData(token: string, callBack: (userData: UserData) => void, error: (message: string) => void) {
        this.checkSessionStorage('userdata', (json) => {
            callBack(JSON.parse(json) as UserData)
        }, (key) => {
            this.getCall(token, 'user', `/data?today=${new Date().toISOString().split('T')[0]}`)
                .then((value) => {
                        sessionStorage.setItem(key, value)
                        callBack(JSON.parse(value) as UserData)
                    }
                )
                .catch(error);
        });
    }

    static loadProjectStructure(user: string, callBack: (structure: ProjectStructure) => void, error: (m: string) => void) {
        this.checkSessionStorage('structure', (json) => {
            callBack(ProjectStructure.parseProjectStructure(json))
        }, (key) => {
            this.getCall(user, 'user', '/structure')
                .then((data) => {
                        sessionStorage.setItem(key, data)
                        callBack(ProjectStructure.parseProjectStructure(data))
                    }
                )
                .catch((e) => error(e.message))
        });
    }


    static getFullProject(token: string, id: string, callBack: (json: string) => void, error: (message: string) => void) {
        this.getCall(token, 'project', `/data?id=${id}`)
            .then(r => callBack(r))
            .catch(e => error(e.message));
    }


    static getProjectTags(token: string, id: string, callBack: (json: string) => void, error: (message: string) => void) {
        this.getCall(token, 'project', `/tag?id=${id}`)
            .then(r => callBack(r))
            .catch(e => error(e.message));
    }

    static getFullTask(token: string, id: string, callBack: (json: string) => void, error: (message: string) => void) {
        this.getCall(token, 'task', `/data?id=${id}`)
            .then(r => callBack(r))
            .catch(e => error(e.message));
    }

    static getTaskTags(token: string, id: string, callBack: (json: string) => void, error: (message: string) => void) {
        this.getCall(token, 'task', `/data/tags?id=${id}`)
            .then(r => callBack(r))
            .catch(e => error(e.message));
    }

    static getUserTags(token: string, callBack: (json: string) => void, error: (message: string) => void) {
        this.getCall(token, 'user', `/tags`)
            .then(r => callBack(r))
            .catch(e => error(e.message));
    }

    static getFullNote(token: string, id: string, callBack: (json: string) => void, error: (message: string) => void) {
        this.getCall(token, 'note', `/data?id=${id}`)
            .then(r => callBack(r))
            .catch(e => error(e.message));
    }

    static loadProjectDashboardTasks(token: string,
                                     projectID: string,
                                     callBack: (json: string) => void,
                                     error: (message: string) => any,
                                     size: number = 10,
                                     page: number = 0) {
        this.checkSessionStorage(projectID + '_tasks_' + size + '_' + page, (json) => {
            callBack(json)
        }, (key) => {
            this.getCall(token, 'project', `/todo?id=${projectID}&size=${size}&page=${page}`)
                .then(value => {
                    sessionStorage.setItem(key, value)
                    callBack(value)
                })
                .catch(e => error(e.message));
        });
    }

    static loadAllTasks(token: string,
                        projectID: string,
                        size: number = 10,
                        page: number = 0,
                        viewAll: boolean,
                        subprojects: boolean,
                        callBack: (r: string) => void,
                        error: (m: string) => any) {
        this.checkSessionStorage(projectID + '_tasks_all_' + size + '_' + page + '_' + viewAll + '_' + subprojects, (json) => {
            callBack(json)
        }, (key) => {
            this.getCall(token, 'project', `/tasks?id=${projectID}&size=${size}&page=${page}&viewall=${viewAll}&subproject=${subprojects}`)
                .then(value => {
                    sessionStorage.setItem(key, value)
                    callBack(value)
                })
                .catch(e => error(e.message));
        });
    }

    static loadProjectNotes(token: string,
                            projectID: string,
                            size: number = 10,
                            page: number = 0,
                            callBack: (r: string) => void,
                            error: (m: string) => any) {
        this.checkSessionStorage(projectID + '_notes_all_' + size + '_' + page, (json) => {
            callBack(json)
        }, (key) => {
            this.getCall(token, 'note', `/project?id=${projectID}&size=${size}&page=${page}`)
                .then(value => {
                    sessionStorage.setItem(key, value)
                    callBack(value)
                })
                .catch(e => error(e.message));
        });
    }

    public static updateProject(token: string, request: ProjectRequest, callBack?: (json: string) => void, error?: (message: any) => void) {
        this.putCall(token, 'project', '/update', JSON.stringify(request)).then((response) => {
            if (response) {
                callBack?.(response);
            }
        }).catch(error)
    }

    static createNewProject(token: string, request: ProjectRequest, callBack?: (json: string) => void, error?: (message: any) => void) {
        this.putCall(token, 'project', '/new', JSON.stringify(request)).then((response) => {
            if (response) {
                callBack?.(response);
            }
        }).catch(error)
    }
    public static updateTask(token: string, request: TaskRequest, callBack?: (json: string) => void, error?: (message: any) => void) {
        this.putCall(token, 'task', '/update', JSON.stringify(request)).then((response) => {
            if (response) {
                callBack?.(response);
            }
        }).catch(error)
    }

    static createNewTask(user: string, request: TaskRequest, callBack?: (json: string) => void, error?: (e: any) => void) {
        this.putCall(user, 'task', '/new', JSON.stringify(request)).then((response) => {
            if (response) {
                callBack?.(response);
            }
        }).catch(error)
    }

    private static checkSessionStorage(name: string, callBack: (json: string) => void, fetchCall: (s: string) => any) {
        const key = MinddyService.updateFactor(name);
        const savedValue = sessionStorage.getItem(key);
        if (savedValue) callBack(savedValue)
        else fetchCall(key);
    }

    private static async getCall(token: string, urlStart: string, urlEnd: string): Promise<string> {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                ...this.getAuthHeader(token),
                'Content-Type': 'application/json'
            },
        };
        let url = this.API_URL.concat(urlStart);
        if (token === 'DEMO') url = url.concat('/demo');
        url = url.concat(urlEnd);

        // If there is any pending request for same url, we return its promise
        const request = this.pendingRequests.get(url);
        if (request) return request;
        // If there is not any request for this url we call the api
        const fetchPromise = this.callAPI(url, options)
            .finally(() => {
                // Once the request is completed, quit the request from pending map
                this.pendingRequests.delete(url);
            });
        //And save the Request as pending request
        this.pendingRequests.set(url, fetchPromise);
        return fetchPromise;
    }

    private static async putCall(token: string, urlStart: string, urlEnd: string, body: string): Promise<string> {
        const options: RequestInit = {
            method: 'POST',
            headers: {
                ...this.getAuthHeader(token),
                'Content-Type': 'application/json'
            },
            body: body
        };
        let url = this.API_URL.concat(urlStart);
        if (token === 'DEMO') url = url.concat('/demo');
        url = url.concat(urlEnd);

        // If there is any pending request for same url, we return its promise
        const request = this.pendingRequests.get(url);
        if (request) return request;
        // If there is not any request for this url we call the api
        const fetchPromise = this.callAPI(url, options).catch((e) => {
            console.log(e.code);
            return e.message || 'error'
        })
            .finally(() => {
                // Once the request is completed, quit the request from pending map
                this.pendingRequests.delete(url);
            });
        //And save the Request as pending request
        this.pendingRequests.set(url, fetchPromise);
        return fetchPromise;
    }

    private static getAuthHeader(token: string) {
        return token === "DEMO" ? undefined : {'Authorization': `Bearer ${token}`};
    }

    private static async callAPI(url: string, options: RequestInit) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            } else {
                const data = await response.json();
                return JSON.stringify(data);
            }
        } catch (error) {
            throw new Error((error as Error).message as string || `API NOT AVAILABLE`);
        }
    }

    private static async pingCall(url: string) {
        const response = await fetch(url);
        return await response.text() === 'pong';
    }


    static createNewNote(token: string, data: NoteRequest, callback?: (json: string) => void, error?: (e: any) => void) {
        this.putCall(token, 'note', '/new', JSON.stringify(data)).then((response) => {
            if (response) {
                callback?.(response);
            }
        }).catch(error)
    }

    public static updateNote(token: string, request: NoteRequest, callBack?: (json: string) => void, error?: (message: any) => void) {
        this.putCall(token, 'note', '/update', JSON.stringify(request)).then((response) => {
            if (response) {
                callBack?.(response);
            }
        }).catch(error)
    }
}



import {ProjectStructure} from "./classes/ProjectStructure";
import {UserConfig} from "./classes/bussiness/MinddyUser";

interface UserData {
    userName: string;
    uiConfig: UserConfig;
}

export default class MinddyService {

    static API_URL = 'http://localhost:8833/v1/auth/'

    static async loadProjectStructure(user: string, callBack: (structure: ProjectStructure) => void) {
        const data = await this.getCall(user,'user','/structure');
        if(data)callBack(ProjectStructure.parseProjectStructure(data));
    }


    static async loadUserData(token: string, callBack: (userData: UserData) => void) {
        const retVal = await this.getCall(token,'user',`/data?today=${new Date().toISOString().split('T')[0]}`);
        if (retVal) callBack(JSON.parse(retVal) as UserData);

    }

    static async getFullProject(token: string, id: string) {
        return await this.getCall(token,'project',`/data?id=${id}`);
    }

    static async getFullTask(token: string, id: string) {
        return await this.getCall(token,'task',`/data?id=${id}`);
    }

    static async loadProjectDashboardTasks(token: string, projectID: string, size: number = 10, page: number = 0) {
        return await this.getCall(token,'project',`/todo?id=${projectID}&size=${size}&page=${page}`)
    }

    static async loadAllTasks(token: string, projectID: string, size: number = 10, page: number = 0, viewAll: boolean, subprojects: boolean) {
        return await this.getCall(token,'project',`/tasks?id=${projectID}&size=${size}&page=${page}&viewall=${viewAll}&subproject=${subprojects}`);
    }

    private static async getCall(token: string, urlStart: string, urlEnd: string) {
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
        return await this.callAPI(url, options);
    }

    private static getAuthHeader(token: string) {
        return token === "DEMO" ? undefined : {'Authorization': `Bearer ${token}`};
    }

    private static async callAPI(url: string, options: RequestInit) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return JSON.stringify(data);
        } catch (error) {
            console.error('Error al realizar la llamada a la API:', error);
        }
    }
}
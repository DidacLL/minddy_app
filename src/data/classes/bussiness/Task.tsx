import {MinddyObject} from "./MinddyObject";
import MinddyService from "../../minddy.service";

export enum Priority {
    LOWER,
    LOW,
    NORMAL,
    HIGH,
    HIGHER
}

interface TaskMinimal {
    id: string;
    date: string;
    holder: string;
    name: string;
    holderName: string;
}
export enum TaskState {
    TODO,
    ON_PROGRESS,
    REVIEW,
    DEFERRED,
    DONE,
    DISCARDED
}

export default class Task extends MinddyObject{
    id: string;
    name: string;
    description: string|undefined;
    date: Date;
    holder: string;
    holderName: string;
    state: TaskState|undefined;
    priority: Priority|undefined;

    constructor(
        id: string,
        name: string,
        date: Date,
        holder: string,
        holderName: string,
        description?: string,
        state?: TaskState,
        priority?: Priority,
    ) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = date;
        this.holder = holder;
        this.state = state;
        this.priority = priority;
        this.holderName = holderName;
    }
    load(token: string, back?: () => any): boolean {
        console.log("Start loading task");
        if (!this.isLoaded) {
            MinddyService.getFullTask(token, this.id).then(
                (response) => {
                    if (response){
                        this.loadFullTask(response);
                        this.isLoaded = true;
                        back?.();
                    }
                })
            return false;
        }
        back?.();
        return this.isLoaded;
    }

    loadFullTask(json: string): void {
        let data = JSON.parse(json);
        this.description = data.description;
        this.date = new Date(data.date);
        this.state = data.state as TaskState;
        this.priority =data.priority as Priority;
    }
    static buildTask(json:string){
        let data=JSON.parse(json) as TaskMinimal
        return new Task(
            data.id,
            data.name,
            new Date(data.date),
            data.holder,
            data.holderName
        )
    }
}
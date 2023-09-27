import {MinddyObject} from "./MinddyObject";
import MinddyService from "../../minddy.service";

export enum Priority {
    LOWER,
    LOW,
    NORMAL,
    HIGH,
    HIGHER
}

export interface TaskMinimal {
    id: string;
}

export interface TaskData {
    id: string;
    name: string;
    description: string;
    date: Date;
    holder: string;
    state: TaskState;
    priority: Priority
}

export enum TaskState {
    TODO,
    ON_PROGRESS,
    REVIEW,
    DEFERRED,
    DONE,
    DISCARDED
}

export default class Task extends MinddyObject {
    id: string;
    name: string | undefined;
    description: string | undefined;
    date: Date | undefined;
    holder: string | undefined;
    state: TaskState | undefined;
    priority: Priority | undefined;

    constructor(
        id: string,
        name?: string,
        date?: Date,
        holder?: string,
        description?: string,
        state?: TaskState,
        priority?: Priority,
    ) {
        super();
        this.id = id;
        if (name) {
            this.name = name;
            if (description) this.description = description;
            if (date) this.date = date;
            if (holder) this.holder = holder;
            if (state) this.state = state;
            if (priority) this.priority = priority;
            this.isLoaded=true;
        }
    }

    static buildTask(json: string) {
        let data = JSON.parse(json) as TaskMinimal
        return new Task(
            data.id
        )
    }

    static parseTask(json: string): Task {
        let data = JSON.parse(json) as TaskData;
        const task = new Task(data.id, data.name, new Date(data.date), data.description, data.holder, data.state as TaskState, data.priority as Priority);
        task.isLoaded=true;
        return task
    }

    // load(token: string, back?: () => any): Task {
    //     console.log("Start loading task");
    //     if (!this.isLoaded) {
    //         MinddyService.getFullTask(token, this.id,
    //             (response) => {
    //                 if (response) {
    //                     this.loadFullTask(response);
    //                     this.isLoaded = true;
    //                     back?.();
    //                 }
    //             },
    //             (m) => {
    //                 console.log(m)
    //                 this.isLoaded = false;
    //             } //todo handle error
    //         )
    //         return this;
    //     }
    //     back?.();
    //     return this;
    // }

    loadFullTask(json: string): void {
        let data = JSON.parse(json) as TaskData;
        this.name = data.name
        this.description = data.description;
        this.date = new Date(data.date);
        this.holder = data.holder;
        this.state = data.state as TaskState;
        this.priority = data.priority as Priority;
    }
}
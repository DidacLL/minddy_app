import {MinddyObject} from "./MinddyObject";
import {Priority} from "../../enums/Priority";
import {TaskState} from "../../enums/TaskState";
import {TaskData} from "../dto/TaskData";

export default class Task extends MinddyObject {
    name: string;
    description: string;
    date: Date | null;
    holder: string;
    state: TaskState;
    priority: Priority;

    constructor(
        id: string,
        name: string,
        date: Date,
        holder: string,
        description: string,
        state: TaskState,
        priority: Priority,
    ) {
        super(id);
            this.name = name;
            this.description = description;
            this.date = date||null;
            this.holder = holder;
            this.state = state;
            this.priority = priority;
            this.isLoaded=true;
    }
    static parseTask(json: string): Task {
        let data = JSON.parse(json) as TaskData;
        const task = new Task(data.id, data.name, new Date(data.date), data.description, data.holder, data.state as TaskState, data.priority as Priority);
        task.isLoaded=true;
        return task
    }
}
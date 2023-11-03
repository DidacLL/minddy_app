import {Priority} from "../../enums/Priority";
import {TaskState} from "../../enums/TaskState";

export interface TaskData {
    id: string;
    name: string;
    description: string;
    date: Date|undefined;
    holder: string;
    state: TaskState;
    priority: Priority
}
import {TaskState} from "../../enums/TaskState";
import {Priority} from "../../enums/Priority";

export interface TaskData {
    id: string;
    name: string;
    description: string;
    date: Date;
    holder: string;
    state: TaskState;
    priority: Priority
}
import {Priority} from "../../enums/Priority";

export interface TaskData {
    id: string;
    name: string;
    description: string;
    date: Date;
    holder: string;
    state: string;
    priority: Priority
}
import {MinddyObject} from "./MinddyObject";
import {Priority} from "../../enums/Priority";
import {TaskState} from "../../enums/TaskState";
import {TaskData} from "../dto/TaskData";
import {MinddyManager} from "../../Minddy.manager";
import {TaskCardBody} from "../../../components/dashboard/TaskCardBody";
import React from "react";
import {TaskFullView} from "../../../components/TaskFullView";
import {PagedResponse} from "../dto/PagedResponse";
import {TaskRow} from "../../../components/TaskRow";

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
        description: string,
        holder: string,
        state: TaskState,
        priority: Priority,
    ) {
        super(id);
        this.name = name;
        this.description = description;
        this.date = date || null;
        this.holder = holder;
        this.state = state;
        this.priority = priority;
        this.isLoaded = true;
    }

    static parseTask(json: string): Task {
        let data = JSON.parse(json) as TaskData;

        // let key: keyof typeof TaskState = data.state as keyof typeof TaskState;
        const task = new Task(data.id, data.name, new Date(data.date), data.description, data.holder, data.state as TaskState, data.priority as Priority);

        task.isLoaded = true;
        return task
    }

    static parseTaskPage(data: PagedResponse<TaskData>) {
        return {
            totalPages: data.totalPages,
            number: data.number,
            totalElements: data.totalElements,
            numberOfElements: data.numberOfElements,
            size: data.size,
            first: data.first,
            last: data.last,
            sort: data.sort,
            content: data.content.map(d => this.fromData(d))
        } as PagedResponse<Task>
    }

    static fromData(data: TaskData) {

        // let key: keyof typeof TaskState = data.state as keyof typeof TaskState;
        return new Task(data.id, data.name, new Date(data.date), data.description, data.holder, data.state as TaskState, data.priority as Priority);

    }

    public resetRequest() {
        this.request = this.getTaskData();
    }

    public getTaskData() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            date: this.date,
            holder: this.holder,
            state: this.state,
            priority: this.priority
        } as TaskData
    }

    public save(token: string) {
        throw new Error("Method not implemented.");
    }

    getTitle() {
        return this.name;
    }

    getCardBody(manager: MinddyManager): React.JSX.Element {
        return <TaskCardBody manager={manager} task={this}/>
    }

    getFullView(manager: MinddyManager): React.JSX.Element {
        return <TaskFullView manager={manager} task={this}/>
    }

    getTableRow() {
        return <TaskRow task={this}/>
    }

    getTableTitle(): React.JSX.Element {
        return <thead><tr>
            <th>Task name</th>
            <th>Description</th>
            <th>DeadLine</th>
            <th>State</th>
        </tr>
        </thead>;
    }
}
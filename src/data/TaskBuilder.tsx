import Task, {TaskRequest} from "./classes/dao/Task";
import {ObjectBuilder} from "./ObjectBuilder";
import {TaskState} from "./enums/TaskState";
import {Priority} from "./enums/Priority";

export class TaskBuilder extends ObjectBuilder<Task,TaskRequest> {


    private _name: string='';
    private _description: string='';
    private _date: Date|undefined;
    private _holder!: string;
    private _state: TaskState=TaskState.ON_PROGRESS;
    private _priority: Priority=Priority.NORMAL;
    isFullFilled(): boolean {
        return (this._name !== undefined && this.name.length > 0);
    }
    build(): TaskRequest {
        if (!this.isFullFilled()) throw Error('Task is not full filled')
        return {
            taskData: {
                id: this.id||'',
                name: this._name,
                description: this._description,
                date: this._date,
                holder: this._holder,
                state: this._state,
                priority: this._priority,
            },
            tags: this.tags || []
        }
    }
    resetData(task?: Task, isNew?: boolean) {
        this.isNew=isNew;
        if (this.isNew || !task) {
            this._name = '';
            this._description = '';
            this._date= new Date();
            this._holder='';
            this._priority=Priority.NORMAL;
            this._state = TaskState.ON_PROGRESS;
            this.tags = [];
        } else {
            this.id = task.id;
            this._name = task.name;
            this._description = task.description||'';
            this._date= task.date;
            this._holder=task.holder;
            this._priority=task.priority;
            this._state = task.state;
            this.tags = task.tags || [];
        }
        return this;
    }
    //-----------------------------------------------------------------------------------------------------Getters & Setters

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get date(): Date | undefined {
        return this._date;
    }

    set date(value: Date | undefined) {
        this._date = value;
    }

    get holder(): string {
        return this._holder;
    }

    set holder(value: string) {
        this._holder = value;
    }

    get state(): TaskState {
        return this._state;
    }

    set state(value: TaskState) {
        this._state = value;
    }

    get priority(): Priority {
        return this._priority;
    }

    set priority(value: Priority) {
        this._priority = value;
    }

}
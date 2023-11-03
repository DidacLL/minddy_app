import {Project, ProjectConfig, ProjectRequest} from "./classes/dao/Project";
import {ProjectState} from "./enums/ProjectState";
import {ObjectBuilder} from "./ObjectBuilder";

export class ProjectBuilder extends ObjectBuilder<Project,ProjectRequest> {


    private _name?: string;
    private _description?: string;
    private _uiConfig?: ProjectConfig;
    private _state?: ProjectState;
    private _deadline?: Date|undefined;
    isFullFilled(): boolean {
        return (this.id !== undefined && this.id.length > 0) &&
            (this._name !== undefined && this._name.length > 0);
    }
    build(): ProjectRequest {
        if (!this.isFullFilled()) throw Error('Project is not full filled')
        return {
            projectData: {
                ownerID: this.isNew ? this.id || '' : this.id?.substring(0, this.id.length - 2) || '',
                projectID: this.isNew ? '' : this.id?.substring(this.id.length - 2) || '',
                projectName: this._name || '',
                description: this._description || '',
                state: this._state?.valueOf() || ProjectState.ACTIVE,
                deadline: this._deadline?.toJSON(),
                uiConfig: JSON.stringify(this._uiConfig),
            },
            tags: this.tags || []
        }
    }
    resetData(project: Project, isNew: boolean) {
        this.id = project.id;
        this.isNew=isNew;
        if (this.isNew) {
            this._name = '';
            this._description = '';
            this._uiConfig = {} as ProjectConfig;
            this._state = ProjectState.ACTIVE;
            this.tags = project.tags;
        } else {
            this._name = project.name;
            this._description = project.description || '';
            this._uiConfig = project.uiConfig || {};
            this._state = project.state;
            this.tags = project.tags || [];
            this._deadline = project.deadline;
        }
        return this;
    }
    //-----------------------------------------------------------------------------------------------------Getters & Setters
    get name(): string {
        if(!this._name)this._name='';
        return this._name;
    }

    set name(value: string) {
        if(value.length<=60)
        this._name = value;
    }

    get description(): string {
        if(!this._description)this._description='';
        return this._description;
    }

    set description(value: string) {

        this._description = value;
    }

    get uiConfig(): ProjectConfig {
        if(!this._uiConfig)this._uiConfig={} as ProjectConfig;
        return this._uiConfig;
    }

    set uiConfig(value: ProjectConfig) {
        this._uiConfig = value;
    }

    get state(): ProjectState {
        if(!this._state)this._state=ProjectState.ACTIVE;
        return this._state;
    }

    set state(value: ProjectState) {
        this._state = value;
    }

    get deadline(): Date|undefined {
        return this._deadline;
    }
    set deadline(date){
        this._deadline=date;
    }
}
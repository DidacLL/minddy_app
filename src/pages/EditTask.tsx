import {MinddyManager} from "../data/Minddy.manager";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Project} from "../data/classes/dao/Project";
import {PathBreadcrumbs} from "../components/dashboard/PathBreadcrumbs";
import {MTextInput} from "../components/edit/MTextInput";
import {i18n} from "@lingui/core";
import {t} from "@lingui/macro";
import {MTextArea} from "../components/edit/MTextArea";
import {EnumSelector} from "./EnumSelector";
import {MinddyToggle} from "../components/dashboard/tabs/MinddyToggle";
import {DeadlineStats} from "../components/dashboard/DeadlineStats";
import {calculateDaysUntil} from "../data/classes/utils/Tools";
import {DateSelector} from "../components/edit/DateSelector";
import {MinddyInputGroup} from "../components/dashboard/tabs/MinddyInputGroup";
import {AttributeLabel} from "../components/AttributeLabel";
import {CogIcon, SwatchIcon, TrashIcon} from "@heroicons/react/24/outline";
import Task from "../data/classes/dao/Task";
import {TaskBuilder} from "../data/TaskBuilder";
import {TaskState, TaskStateName} from "../data/enums/TaskState";

export interface EditTaskProps {
    manager: MinddyManager
}

export default function EditTask(props: EditTaskProps) {

    const params = useParams();
    const navigate = useNavigate();
    const isNew = params.isNew as unknown as number > 0 || false;
    const [task, setTask] = useState<Task>();


    const [project, setProject] = useState<Project>();
    const [builder, setBuilder] = useState<TaskBuilder>();

    //------------------------------------------------------------------------------------------------------------------MOUNT
    useEffect(() => {
        try {
            const taskId = params.taskId;
            const projectId = params.projectId;
            if (taskId && !isNew) {props.manager.getTask(taskId, v=> {
                setBuilder(props.manager.taskBuilder.resetData(v))
                setTask(v)
            }, e => {
            })}else {
               setBuilder(props.manager.taskBuilder.resetData(undefined,true))
            }
            if (projectId) {
                const recoveredProject= props.manager.getProject(projectId)
                if(recoveredProject)setProject(recoveredProject)
            }
            props.manager.disableProjectTreePanel(true);
        } catch (e) {
        }
        return () => {
            try {
                props.manager.disableProjectTreePanel(false);
            } catch (e) {
            }
        }
    }, []);

    useEffect(() => {
        builder?.resetData(task, isNew)
    }, [task]);
    useEffect(() => {
        if(builder && project)builder.holder=project.id;
    }, [project]);

    return <div className='h-full w-full flex flex-col justify-between'>
        {/*HEADER                                                                    */}
        <div className='w-full h-min flex justify-between '>
            <label className='whitespace-nowrap mx-4'>Parent Project:</label>
            {builder?.holder && <PathBreadcrumbs
                path={props.manager.getProject(builder.holder)?.getAllProjectsPath()?.map(id => props.manager.getProject(id) || props.manager.getRootProject())}
                handleClick={() => {//todo
                }}/>}

            <label
                className=' z-20 btn btn-shadow btn-circle right-0 txt-l font-mono btn-sm mx-2  hover:text-opacity-60 '
                onClick={e => navigate('/dashboard/' + task?.holder)}> x </label>
        </div>
        {/*                                 BODY                                                                    */}
        <div className='grow bg-base-100'>
            {builder && <div
                className=' grid grid-cols-[repeat(auto-fill,minmax(20em,1fr))] gap-[2rem]  h-full grid-flow-row-dense justify-center '>
                <div className='input-group-vertical'>
                    <MTextInput maxChar={30}
                                name={i18n._(t`Task name`)}
                                onChange={(val: string) => {
                                    builder.name = val;
                                }}
                                tip={i18n._(t`Task name tip`)}
                                placeHolder={i18n._(t`Task placeholder`)}
                                initialValue={builder.name}
                    />
                    <MTextArea maxChar={180}
                               name={i18n._(t`Task description`)}
                               onChange={(val: string) => {
                                   builder.description = val;
                               }}
                               tip={i18n._(t`Task description tip`)}
                               placeHolder={i18n._(t`description placeholder`)}
                               initialValue={builder.description}
                    />
                </div>
                <div className='z-10 input-group-vertical relative'>

                    {builder && <EnumSelector<TaskState> names={Object.values(TaskStateName)}
                                                         onChange={(v) => {
                                                             builder.state = v;
                                                         }}
                                                         title={i18n._(t`Task State`)}
                                                         values={Object.values(TaskState) as TaskState[]}
                                                         initialValue={builder.state}
                                                         tip={'Select the current state for this Task'}/>}

                </div>
                <div>
                    <MinddyToggle onClick={(e) => {
                    }} value={true} text={'pinned'}/>
                    <MinddyToggle onClick={(e) => {
                    }} value={true} text={'favourite'}/>
                </div>
                <div>
                    {builder && (builder.date instanceof Date) &&
                        <DeadlineStats daysMissing={calculateDaysUntil(builder.date)}
                                       deadLine={builder.date}/>}
                    <DateSelector title={'Deadline'} onChange={
                        (d) => builder.date = d
                    }
                                  initialValue={builder.date}/>
                </div>
            </div>
            }
        </div>

        {/*                                 FOOTER                                                                    */}
        <div className='w-full h-min min-h-12 flex'>
            <div className='input-group  flex justify-between'>

                <MinddyInputGroup
                    child={[
                        <AttributeLabel text={'Discard changes'} clazzName='txt-mb m-2'/>,
                        <TrashIcon className='btn btn-circle p-1 m-1 btn-sm btn-shadow'/>]}
                />
                <MinddyInputGroup
                    child={[
                        <AttributeLabel text={''} clazzName='txt-mb m-2'/>,
                        <SwatchIcon className='btn btn-circle  p-1 m-1 btn-sm btn-shadow'/>]}
                />
                <div onClick={saveTask}>
                    <MinddyInputGroup
                        child={[
                            <AttributeLabel text={i18n._('save')} clazzName='txt-mb m-2'/>,
                            <CogIcon className='btn btn-circle p-1 m-1   btn-sm btn-shadow'/>
                        ]}

                    />
                </div>

            </div>
        </div>
        {/*<div className=' h-full w-full'>*/}
        {/*</div>*/}
    </div>

    function saveTask() {
        if (builder && builder.isFullFilled())
            isNew ? props.manager.newTask(builder.build(), (v) => {
                    props.manager.updateAllData(
                        ignored => navigate('/dashboard/' + v.holder));
                })
                : props.manager.updateTask(builder.build(), (v) => {
                        props.manager.updateAllData(
                            ignored => navigate('/dashboard/' + v.holder));
                    }
                );
    }

}
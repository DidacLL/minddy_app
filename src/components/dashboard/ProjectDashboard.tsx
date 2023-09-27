import {MinddyManager} from '../../data/Minddy.manager';
import React, {useEffect, useState} from 'react';
import {HorizontalScroller} from './HorizontalScroller';
import {Project} from '../../data/classes/bussiness/Project';
import {PathBreadcrumbs} from './PathBreadcrumbs';
import {DashboardTab} from '../../pages/MainScreen';
import {DeadlineStats} from './DeadlineStats';
import {EllipsisVerticalIcon, PencilSquareIcon} from '@heroicons/react/20/solid';
import MinddyService, {PagedResponse} from "../../data/minddy.service";
import Task, {TaskMinimal} from "../../data/classes/bussiness/Task";

export function ProjectDashboard(props: { manager: MinddyManager }) {
    const [path, setPath] = useState<Project[] | undefined>();

    const [todoList, setTodoList] = useState<TaskMinimal[]>([]);
    const [daysMissing, setDaysMissing] = useState<number>();
    const calculateDaysUntilDeadline = (deadline: Date) => {
        const now = new Date();
        const timeDiff = deadline.getTime() - now.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convertir a días
    }

    useEffect(() => {
        try {
            setPath(props.manager.currentProject.getAllProjectsPath().map((id) => {
                return props.manager.structure?.nodeMap.get(id)?.project || props.manager.currentProject;
            }))

        } catch (e) {
            //todo
        }
        if (props.manager.currentProject.deadLine) setDaysMissing(calculateDaysUntilDeadline(props.manager.currentProject.deadLine))
    }, [props.manager.currentProject]);



    useEffect(() => {
    }, [todoList]);
    return <div className='flex flex-col p-2 h-full flex-grow w-full '>

        <div className='flex flex-row w-[100%] justify-between grow overflow-hidden '>
            <div className='flex flex-col  place-content-between min-h-full overflow-hidden'>
                {path && <PathBreadcrumbs path={path} handleClick={(p) => props.manager.changeCurrentProject(p)}/>}

                <div className='flex justify-between'>
                    <label className='text-xl font-black'>
                        {props.manager.currentProject.isRootProject() ? new Date().toLocaleDateString() : props.manager.currentProject.name}
                    </label>

                </div>
                <label>
                    Description: {props.manager.currentProject.description}
                </label>
                <label>State: {props.manager.currentProject.state} </label>

                <div className=' m-2 bg-'>
                    <HorizontalScroller label={'TO-DO'} manager={props.manager} elements={todoList.map(v=>v.id)}/>
                </div>
                <div className=' m-2 bg-'>
                    <HorizontalScroller label={'NOTES'} manager={props.manager} elements={todoList.map(v=>v.id)}/>
                </div>
                <div className='stats flex flex-row m-4 overflow-hidden text-sm'>
                    <div className='stat'>
                        <div className='stat-title'>Pending tasks:</div>
                        <div onClick={() => {
                            props.manager.changeDashboardTab(DashboardTab.TASKS)
                        }}
                             className='stat-value btn btn-ghost'>{props.manager.currentProject.pendingTasks}</div>
                        <div className='stat-desc'></div>
                    </div>
                    <div className='stat'>
                        <div className='stat-title'>Subprojects:</div>
                        <div onClick={() => {
                            props.manager.minimizeProjectTree()
                        }}
                             className='stat-value btn-ghost btn'>{props.manager.structure?.nodeMap.get(props.manager.currentProject.id)?.accumulatedSubprojects}</div>
                        <div className='stat-desc'></div>
                    </div>
                    <div className='stat '>
                        <div className='stat-title'>Notes:</div>
                        <div onClick={() => {
                            props.manager.changeDashboardTab(DashboardTab.NOTES)
                        }}
                             className='stat-value btn-ghost btn'>{props.manager.currentProject.numNotes}</div>
                        <div className='stat-desc'></div>
                    </div>
                </div>
            </div>
            <div className='max-w-fit pl-4 '>
                <div className=' flex justify-end align-top'>
                    <div className='flex justify-end ' data-tip={'edit..'}>
                        <div className='tooltip tooltip-bottom flex ' data-tip={'edit..'}>
                            <PencilSquareIcon className='h-8 hover:cursor-pointer hover:text-base-300'/>
                        </div>
                        <div className='tooltip tooltip-bottom flex' data-tip={'options..'}>
                            <EllipsisVerticalIcon className='h-8 hover:cursor-pointer hover:text-base-300'/>
                        </div>
                    </div>
                </div>
                {props.manager.currentProject.deadLine &&
                    <DeadlineStats daysMissing={daysMissing} deadLine={props.manager.currentProject.deadLine}/>}

            </div>
        </div>
    </div>
}
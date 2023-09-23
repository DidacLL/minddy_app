import {AppData} from '../../data/classes/AppData';
import React, {useEffect, useState} from 'react';
import {HorizontalScroller} from './HorizontalScroller';
import {Project} from '../../data/classes/bussiness/Project';
import {PathBreadcrumbs} from './PathBreadcrumbs';
import {DashboardTab} from '../../pages/MainScreen';
import {DeadlineStats} from './DeadlineStats';
import {EllipsisVerticalIcon, PencilSquareIcon} from '@heroicons/react/20/solid';

export function ProjectDashboard(props: { appData: AppData }) {
    const [path, setPath] = useState<Project[] | undefined>();

    const [daysMissing, setDaysMissing] = useState<number>();
    const calculateDaysUntilDeadline = (deadline: Date) => {
        const now = new Date();
        const timeDiff = deadline.getTime() - now.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convertir a días
    }

    useEffect(() => {
        setPath(props.appData.currentProject.getAllProjectsPath().map((id) => props.appData.structure.nodeMap.get(id)?.project || props.appData.currentProject))
        if (props.appData.currentProject.deadLine) setDaysMissing(calculateDaysUntilDeadline(props.appData.currentProject.deadLine))
    }, [props.appData.currentProject]);

    return <div className='flex flex-col p-2  relative flex-grow w-full '>

        <div className='flex flex-row justify-between w-[100%] flex-grow  overflow-hidden '>
            <div className='flex flex-col flex-grow justify-between min-h-full overflow-hidden   '>
                    {path && <PathBreadcrumbs path={path} handleClick={(p) => props.appData.changeCurrentProject(p)}/>}

                <div className='flex justify-between'>
                    <label className='text-xl font-black'>
                        {props.appData.currentProject.isRootProject()?new Date().toLocaleDateString():props.appData.currentProject.name}
                    </label>

                </div>
                <label>
                    Description: {props.appData.currentProject.description}
                </label>
                <label>State: {props.appData.currentProject.state} </label>

                <div className=' m-2 bg-'>
                    <HorizontalScroller label={'TO-DO'} appData={props.appData}/>
                </div>
                <div className=' m-2 bg-'>
                    <HorizontalScroller label={'NOTES'} appData={props.appData}/>
                </div>
                <div className='stats flex flex-row m-4 overflow-hidden text-sm'>
                    <div className='stat'>
                        <div className='stat-title'>Pending tasks:</div>
                        <div onClick={() => {
                            props.appData.changeDashboardTab(DashboardTab.TASKS)
                        }}
                             className='stat-value btn btn-ghost'>{props.appData.currentProject.pendingTasks}</div>
                        <div className='stat-desc'></div>
                    </div>
                    <div className='stat'>
                        <div className='stat-title'>Subprojects:</div>
                        <div onClick={() => props.appData.minimizeProjectTree()}
                             className='stat-value btn-ghost btn'>{props.appData.structure.nodeMap.get(props.appData.currentProject.id)?.accumulatedSubprojects}</div>
                        <div className='stat-desc'></div>
                    </div>
                    <div className='stat '>
                        <div className='stat-title'>Notes:</div>
                        <div onClick={() => {
                            props.appData.changeDashboardTab(DashboardTab.NOTES)
                        }}
                             className='stat-value btn-ghost btn'>{props.appData.currentProject.numNotes}</div>
                        <div className='stat-desc'></div>
                    </div>
                </div>
            </div>
            <div className='max-w-fit pl-4 '>
                <div className=' flex justify-end align-top'>
                    <div className='flex justify-end ' data-tip={'edit..'}>
                        <div className='tooltip tooltip-bottom flex' data-tip={'edit..'}>
                            <PencilSquareIcon
                                className='h-7 hover:cursor-pointer hover:bg-transparent hover:text-primary'/>
                        </div>
                        <div className='tooltip tooltip-bottom flex' data-tip={'options..'}>
                            <EllipsisVerticalIcon
                                className='h-8 hover:cursor-pointer hover:bg-transparent hover:text-primary'/>
                        </div>
                    </div>
                </div>
                {props.appData.currentProject.deadLine &&
                    <DeadlineStats daysMissing={daysMissing} deadLine={props.appData.currentProject.deadLine}/>}

            </div>
        </div>
    </div>
}
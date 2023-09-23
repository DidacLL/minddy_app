import {AppData} from "../data/classes/AppData";
import {EllipsisVerticalIcon, PencilSquareIcon} from "@heroicons/react/20/solid";
import {DeadlineStats} from "../components/dashboard/DeadlineStats";
import React, {useEffect, useState} from "react";
import Task from "../data/classes/bussiness/Task";
import {Trans} from "@lingui/macro";

export function ProjectTasks(props: { appData: AppData }) {
    const [tasks, setTasks] = useState<Task[]>();

    const [viewAll, setViewAll] = useState(false);

    const [viewSubprojects, setViewSubprojects] = useState(true);
    useEffect(() =>
            updateTaskViews()
        , [viewAll, viewSubprojects]);

    useEffect(() => {
        updateTaskViews();
        setViewAll(false);
        setViewSubprojects(true)
    }, [props.appData.currentProject, props.appData.user.token]);

    function updateTaskViews() {
        if (props.appData.currentProject)
            props.appData.currentProject.getAllTasks(
                props.appData.user.token,
                props.appData.currentProject.id,
                (json) => {
                    if (json) {
                        const tasks = JSON.parse(json).content.map((task: any) => Task.buildTask(JSON.stringify(task)));
                        setTasks(tasks);
                    }
                },
                10,
                0,
                viewAll,
                viewSubprojects);
    }

    return <div className='flex flex-col p-2  relative flex-grow w-full '>
        <div className='flex flex-row justify-between w-[100%] flex-grow  overflow-hidden '>
            <div className='flex flex-col flex-grow justify-between min-h-full overflow-hidden   '>
                {/*_________OPTIONS____________*/}
                <div className='menu menu-horizontal form-control text-xs'>
                    <div className='btn btn-ghost cursor-pointer'
                         onClick={() => setViewSubprojects(!viewSubprojects)}>
                        <div className='label-text'><Trans> Include Subprojects:</Trans>:</div>
                        <input type='checkbox'
                               className={`toggle-xs toggle ${viewSubprojects ? 'bg-base-accent' : 'bg-base-200'}`}
                               checked={viewSubprojects} onChange={() => setViewSubprojects(!viewSubprojects)}/>
                    </div>
                    <div className='btn btn-ghost label cursor-pointer'
                         onClick={() => setViewAll(!viewAll)}>
                        <div className='label-text'><Trans> Only Pending Tasks</Trans>:</div>
                        <input type='checkbox'
                               className={`toggle-xs toggle ${viewAll ? 'bg-base-accent' : 'bg-base-200'}`}
                               checked={viewAll} onChange={() => setViewAll(!viewAll)}
                        />
                    </div>
                </div>
                {tasks && tasks.map((t) =>
                    <label className='text-xl font-black'>{t.name} </label>)}
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
                    <DeadlineStats daysMissing={3} deadLine={props.appData.currentProject.deadLine}/>}

            </div>
        </div>
    </div>;
}
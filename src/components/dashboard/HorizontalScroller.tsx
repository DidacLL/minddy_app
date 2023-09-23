import React, {useEffect, useState} from "react";
import Task from "../../data/classes/bussiness/Task";
import {TaskCard} from "./TaskCard";
import {AppData} from "../../data/classes/AppData";

export function HorizontalScroller(props: { label: string, appData: AppData}) {

    const [tasks, setTasks] = useState<Task[]>();

    useEffect(() => {
        props.appData.currentProject.getPendingTasks(props.appData.user.token, props.appData.currentProject.id, (json) => {
            if (json) {
                const tasks = JSON.parse(json).content.map((task: any) => Task.buildTask(JSON.stringify(task)));
                setTasks(tasks);
            }
        });
    }, [props.appData.currentProject, props.appData.user.token]);
    const taskCards: React.JSX.Element[] | undefined = tasks?.map((t) => <TaskCard task={t}/>);
    return (
        <div className="flex flex-col md:flex-row justify-start items-center w-[100%] bg-base-300 rounded-box p-1">
            <div className="transform -rotate-90 origin-center justify-self-start max-h-min relative -mr-24 -inset-x-16 ">
                <label className="text-5xl font-extrabold font-sans text-base-100 whitespace-nowrap overflow-hidden -m-2 ">
                    {props.label}
                </label>
            </div>
            {/* no-scrollbar overflow-x-scroll overflow-y-hidden*/}
            <div className=" h-[9em] rounded flex flex-row max-w-full pr-10 flex-nowrap text-center gap-4 py-2 overflow-x-scroll no-scrollbar"
            >
                {taskCards?.map(el => el)}
            </div>
        </div>
    );
}
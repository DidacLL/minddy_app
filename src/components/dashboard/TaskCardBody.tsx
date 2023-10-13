import {MinddyManager} from "../../data/Minddy.manager";
import {ShortDate} from "./ShortDate";
import Task from "../../data/classes/dao/Task";

export function TaskCardBody(props: {
    manager: MinddyManager,
    task: Task
}) {
    return <div className="flex  flex-col grow h-full justify-between ">
        <div className='h-min'>
            <div style={{float: 'right', marginLeft: '10px', textAlign: 'right'}}>
                {props.task.date ? <ShortDate date={props.task.date} text={true} clazzName='text-base-300'/> : "ASAP"}
                <span className='text-right font-extrabold font-mono text-base-300'>{props.task.state}</span>
            </div>
            <div className='text-left'>
                {props.task.description}
            </div>
        </div>
        <div
            className="mask-frame select-none text-base-100 bg-base-300 hover:bg-secondary cursor-pointer select-disabled font-bold rounded-b-box w-full mb-1"
            onClick={(e) => {
                const p = props.manager.getProject(props.task.holder);
                if (p) props.manager.changeCurrentProject(p)
            }}>
            {props.manager.getProject(props.task.holder)?.name}
        </div>


    </div>;
}
import Task from '../../data/classes/bussiness/Task';
import React, {useEffect, useState} from 'react';

export function TaskCard(props: { task: Task }) {
        const dateString = new Date(props.task.date? props.task.date : '').toLocaleDateString();

    const [task, setTask] = useState<Task>();

    useEffect(() => {
        props.task && setTask(props.task);
    }, []);
    useEffect(() => {
        setTask(task)
    }, [task]);

    return <div className='right-shadow card-compact bg-base-100 hover:-rotate-3 active:scale-95 w-64'>
        <div className='card-title bg-primary text-center justify-center rounded-t-box text-xs text-main-light p-1 '>

            <div className='text-ellipsis truncate'>
                {task?.description}
            </div>
        </div>
        <div className='card-body '>
            {dateString || 'ASAP'}
        <div className='text-ellipsis truncate'>
            </div>
        </div>
    </div>
}
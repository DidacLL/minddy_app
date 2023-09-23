import Task from '../../data/classes/bussiness/Task';
import React from 'react';

export function TaskCard(props: { task: Task }) {
    let dateString = props.task.date?.toLocaleDateString();
    return <div className='card right-shadow card-compact bg-base-100 hover:-rotate-3 active:scale-95 w-32'>
        <div className='card-title bg-primary text-center justify-center rounded-t-box text-main-light p-1 '>
            {dateString || 'ASAP'}
        </div>
        <div className='card-body '>
            <div className='text-ellipsis truncate'>
                {props.task.name}
            </div>
        <div className='text-ellipsis truncate'>
                {props.task.holderName}
            </div>
        </div>
    </div>
}
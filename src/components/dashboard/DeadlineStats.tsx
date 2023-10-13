import React from "react";
import {ShortDate} from "./ShortDate";
import {getDayOfWeekLabel} from "../../data/classes/utils/Tools";

export enum DayOfWeek{
    
}

export function DeadlineStats(props: { daysMissing: number | undefined, deadLine: Date ,size?:number}) {
    // let dayOfWeek: React.JSX.Element;
    const clazz:string='stat-desc font-black mr-[-0.5em] txt-m text-right';
    // useEffect(() => {
    const dayOfWeek = getDayOfWeekLabel(props.deadLine,false,clazz);


    return <div className=" stats max-w-fit max-h-fit place-content-around flex justify-around "
                style={{fontSize: props.size ? (props.size + 'rem') : '1.5rem'}}>
        <div className="stat flex flex-col justify-around txt-m">
            <div className='mask-frame stat-value max-h-[1.5em] scale-x-125 text-right opacity-80 txt-s h-fit  '>
                {props.deadLine.getFullYear()}
            </div>
            <ShortDate date={props.deadLine}/>
            {dayOfWeek}
            {props.size && props.size >= 1 && <label className={`stat-desc txt-xs mt-[0.25em]`}>
                {props.daysMissing ?
                    props.daysMissing > 0 ?
                        props.daysMissing +
                        (props.daysMissing === 1 ? ' day missing' : ' days missing')
                        :
                        (props.daysMissing * -1) +
                        (props.daysMissing === 1 ? ' day passed' : 'days passed')
                    : ''}
            </label>}

        </div>
    </div>;
}
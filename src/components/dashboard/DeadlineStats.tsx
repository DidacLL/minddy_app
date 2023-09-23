import React from "react";
import {Trans} from "@lingui/macro";

export enum DayOfWeek{
    
}
export function DeadlineStats(props: { daysMissing: number | undefined, deadLine: Date }) {
    let dayOfWeek: React.JSX.Element;
    const clazz:string='stat-desc font-black text-xl text-right';
    // useEffect(() => {
        switch (props.deadLine.getDay()) {
            case 1:
                dayOfWeek = <label className={clazz}><Trans>Monday</Trans></label>;
                break;
            case 2:
                dayOfWeek= <label className={clazz}><Trans>Thursday</Trans></label>;
                break;
            case 3:
                dayOfWeek= <label className={clazz}><Trans>Wednesday</Trans></label>;
                break;
            case 4:
                dayOfWeek= <label className={clazz}><Trans>Tuesday</Trans></label>;
                break;
            case 5:
                dayOfWeek= <label className={clazz}><Trans>Friday</Trans></label>;
                break;
            case 6:
                dayOfWeek= <label className={clazz}><Trans>Saturday</Trans></label>;
                break;
            default:
                dayOfWeek= <label className={clazz}><Trans>Sunday</Trans></label>;
        }


    return <div className="stats bg-transparent scale-125 overflow-hidden ">
        <div className="stat ">
            <label className="text-xs  stat-value pr-2 scale-x-125 text-right text-opacity-50 opacity-50">
                {props.deadLine.getFullYear()}
            </label>
            <div
                className={`-mb-1.5 -mt-1 align-text-bottom stat-value text-right flex justify-end  ${props.daysMissing ? (props.daysMissing < 8 ? "text-error" : props.daysMissing > 16 ? "text-success" : "text-warning") : ""}`}>
                <label
                    className='scale-110 pr-1'>{props.deadLine.getDate()}</label>
                <label
                    className='mt-1 text-xl whitespace-nowrap '>/{props.deadLine.getMonth()+1}</label>

            </div>
            {dayOfWeek}
            <label className={`stat-desc`}> {props.daysMissing} days missing </label>

        </div>
    </div>;
}
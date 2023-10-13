import React, {useEffect, useState} from "react";
import {calculateDaysUntil, getDayOfWeekLabel} from "../../data/classes/utils/Tools";

export function ShortDate(props: { date: Date, text?: boolean, clazzName?: string }) {

    const [daysMissing, setDaysMissing] = useState<number>(calculateDaysUntil(props.date))

    useEffect(() => {
        setDaysMissing(calculateDaysUntil(props.date))
    }, [props.date]);
    return !props.text ?
        <div className={` txt-m  max-h-[3em] h-fit stat-value text-right flex justify-end place-items-baseline  ${props.clazzName ?
                (props.clazzName)
                :
                (daysMissing > 0 ?
                    (daysMissing < 8 ? "text-warning"
                        :
                        daysMissing > 16 ? "text-success"
                            : "")
                    :
                    "text-error")
            }`}
        >

            <label className="txt-3xl ">{props.date.getDate()}</label>
            <label className="txt-l mask-upper-x whitespace-nowrap ">/{props.date.getMonth() + 1}</label>

        </div>
        :
        <div  className={`txt-l  max-h-[3em] h-fit stat-value text-right flex place-items-start ${props.clazzName ?
            (props.clazzName)
            :
            (daysMissing > 0 ?
                    (daysMissing < 8 ? "text-warning"
                        :
                        daysMissing > 16 ? "text-success"
                            :
                            "")
                    :
                    "text-error"
            )
        }`}
        >
            <label className="txt-3xl ">{props.date.getDate()}</label>
            <div className='  flex flex-col p-0 txt-xs m-0  justify-start -mt-1 '>
                {getDayOfWeekLabel(props.date, true, 'h-[1em] txt-l ')}
                <label className="txt-xxl h-[1em] whitespace-nowrap flex-shrink ">/{props.date.getMonth() + 1}</label>
            </div>
        </div>

}
import {Trans} from "@lingui/macro";
import React from "react";

export function calculateDaysUntil (date: Date){
    const now = new Date();
    const timeDiff = date.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convertir a días
}

export function getDayOfWeekLabel(date: Date,short?:boolean, clazz?: string) {
    switch (date.getDay()) {
        case 1:
            return <label className={clazz}>{short? <Trans>Mon</Trans>:<Trans>Monday</Trans>}</label>;
        case 2:
            return <label className={clazz}>{short? <Trans>Thu</Trans>:<Trans>Thursday</Trans>}</label>;
        case 3:
            return <label className={clazz}>{short? <Trans>Wed</Trans>:<Trans>Wednesday</Trans>}</label>;
        case 4:
            return <label className={clazz}>{short? <Trans>Tue</Trans>:<Trans>Tuesday</Trans>}</label>;
        case 5:
            return <label className={clazz}>{short? <Trans>Fri</Trans>:<Trans>Friday</Trans>}</label>;
        case 6:
            return <label className={clazz}>{short? <Trans>Sat</Trans>:<Trans>Saturday</Trans>}</label>;
        default:
            return <label className={clazz}>{short? <Trans>Sun</Trans>:<Trans>Sunday</Trans>}</label>;
    }
}


export function getTxtSize(size:number){
    if(size<=-3)return 'xxs'
    if(size<=-2)return 'xs'
    if(size<=-1)return 's'
    if(size<=-0)return 'm'
    if(size<=1)return 'l'
    if(size<=2)return 'xl'
    if(size<=3)return 'xxl'
    if(size<=4)return '3xl'
    if(size>=5)return 'monster'

}
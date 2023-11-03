import React from "react";
import {MinddyInputGroup} from "./MinddyInputGroup";

export function MinddyToggle(props: { onClick: (ev?:any) => void, value: boolean, text:string ,clazzName?:string,strokeColor?:string}) {
    return <MinddyInputGroup child={[
        <div
            className={`cursor-pointer  btn-shadow badge badge-lg bg-transparent select-none flex align-bottom ${props.value && 'force-shadow-in'}`}
            onClick={(event)=>props.onClick(event)}>
            <div className="label-text txt-s p-1 lowercase">{props.text}</div>
        </div>,
        <input type="checkbox"
               className={` toggle-xs txt-s bottom-0  mx-2  toggle ${props.value ? "bg-base-content" : "bg-base-200"}`}
               checked={props.value} onChange={event => props.onClick(event)}/>

    ]}/>
}
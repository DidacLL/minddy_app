import React from "react";

export function MinddyInputGroup(props:{child:React.JSX.Element[]}) {
    return <div className="menu menu-horizontal form-control m-0 p-0 opacity-75 outline-1 badge bg-transparent w-auto h-min hover:opacity-100 mx-2">
        {props.child}
    </div>;
}
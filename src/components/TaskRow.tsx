import {ShortDate} from "./dashboard/ShortDate";
import React from "react";
import Task from "../data/classes/dao/Task";

export function TaskRow(props: { task: Task }) {
    return <tr>
        <td>{props.task.name}</td>
        <td>{props.task.description}</td>
        <td>{props.task.date ? <ShortDate date={props.task.date}/> : "ASAP"}</td>
        <td>{props.task.state}</td>
    </tr>;
}
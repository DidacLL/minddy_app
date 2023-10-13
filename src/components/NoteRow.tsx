import React from "react";
import {Note} from "../data/classes/dao/Note";
import {TagBadge} from "./TagBadge";

export function NoteRow(props: { note: Note }) {
    return <tr>
        <td>{props.note.name}</td>
        <td>{props.note.body}</td>
        <td>{props.note.tags.map(t=> <TagBadge tagName={t}/>)}</td>
    </tr>;
}
import {MinddyManager} from "../data/Minddy.manager";
import {useParams} from "react-router-dom";

export interface EditNoteProps {
    manager: MinddyManager | undefined
}

export default function EditNote(props: EditNoteProps) {
    const params = useParams();


    return <div className='h-full w-full bg-warning'></div>;
}
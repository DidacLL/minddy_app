import {MinddyManager} from "../data/Minddy.manager";
import {useParams} from "react-router-dom";

export interface EditTaskProps {
    appData: MinddyManager | undefined
}

export default function EditTask(props: EditTaskProps) {

    const params = useParams();


    return <div className='h-full w-full bg-warning'></div>;
}
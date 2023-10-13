import {MinddyObject} from "../../data/classes/dao/MinddyObject";
import {useEffect, useState} from "react";
import {MinddyManager} from "../../data/Minddy.manager";
import {Trans} from "@lingui/macro";
import ResponsiveText from "../../data/classes/utils/ResponsiveText";

interface ObjectTableParams<T extends MinddyObject> {
    // getFunction: (id: string, callback: (object: T) => void, error: (e: any) => void) => void;
    // ids: ObjectMinimal[]
    manager: MinddyManager;
    objects: T[];
}

export function ObjectTable<T extends MinddyObject>(props: ObjectTableParams<T>) {
    // const [ids, setIds] = useState(props.ids);

    const [objects, setObjects] = useState<T[]>();

    useEffect(() => {
        setObjects(props.objects);
    }, []);
    useEffect(() => {
        setObjects(props.objects);
    }, [props.manager.currentProject,props.objects]);
    useEffect(() => {

    }, [objects]);
    if (!objects || objects.length <= 0) {
        //-----------------------------------------------------------Empty
        return <div className='w-full h-full flex text-center items-center justify-center'>
            <ResponsiveText text={<Trans>Nothing to do here...</Trans>} max={120} min={16}/>
        </div>;
    }

//-------------------------------------------------------------------------------------------------TABLE
    return <table className="table table-zebra ">
            {/* head */}
            {objects && objects.at(0)?.getTableTitle()}
        <tbody className=' '>
        {objects?objects.map((obj,index) =>obj.getTableRow()):<div className='loading-bars'/> }
        </tbody>
        </table>
}
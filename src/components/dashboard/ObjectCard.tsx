import React, {useEffect, useState} from 'react';
import {MinddyObject} from "../../data/classes/dao/MinddyObject";

export function ObjectCard<T extends MinddyObject>(props: { getter:  (id: string, callback: (element: T) => any, error: (e: any) => any) => void, id: string }) {
    // const dateString = () => object && object.date ? new Date(object.date).toLocaleDateString() : undefined;

    const [object, setObject] = useState<T>();

    useEffect(() => {
        console.log("new card!")
        props.getter(props.id,obj=>{
            setObject(obj)
        },
            e=>{

            })
    }, []);
    useEffect(() => {
    }, [object]);

    return object && object.isLoaded ?
        <div className='right-shadow card-compact bg-base-100 hover:-rotate-3 active:scale-95 w-64'>
            <div
                className='card-title bg-primary text-center justify-center rounded-t-box text-xs text-main-light p-1 '>

                <div className='text-ellipsis truncate'>
                    {object?.id}
                </div>
            </div>
            <div className='card-body'>
                {'ASAP'} aa
                <div className='text-ellipsis truncate'>
                    o
                </div>
            </div>
        </div>
        :
        <div>

        </div>
}
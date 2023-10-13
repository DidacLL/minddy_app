import React, {useEffect, useRef, useState} from 'react';
import {MinddyObject} from "../../data/classes/dao/MinddyObject";
import {MinddyManager} from "../../data/Minddy.manager";

interface ObjectCardParams<T extends MinddyObject> {
    manager: MinddyManager;
    getter?: (id: string, callback: (element: T) => any, error: (e: any) => any) => void;
    id: string;
    width?: number;
    height?: number;
    clazzName?: string;
    setRef: (el:HTMLDivElement)=>any;
}


export function ObjectCard<T extends MinddyObject>(props: ObjectCardParams<T>) {
    // const dateString = () => object && object.date ? new Date(object.date).toLocaleDateString() : undefined;

    // const modal = useRef<HTMLDialogElement>(null);
    const [object, setObject] = useState<T>();
    const [body, setBody] = useState<React.JSX.Element>();
    const [title, setTitle] = useState('');
    const ref = useRef(null);
    useEffect(() => {
        if (props.getter) props.getter(props.id, obj => {
            setObject(obj)
        }, e => {

        })
    }, []);
    useEffect(() => {
        if (object) {
            setTitle(object.getTitle())
            setBody(object.getCardBody(props.manager))
        }
    }, [object]);

    useEffect(() => {
        if(ref.current)props.setRef(ref.current);
    }, [ref]);
    return props.getter && object && object.isLoaded ?
        <div ref={ref}
             onClick={() => {
                 object && props.manager.openModal(object?.getFullView(props.manager))
             }}
             className={`right-shadow card card-compact  bg-base-100 m_object rounded-box h-fill  min-h-[8em] min-w-[10em] w-auto max-width-prose ${props.clazzName}`}

        >

            <div
                className='card-title bg-primary  text-center justify-center rounded-t-box text-xs text-main-light p-1 '>

                <div className='text-ellipsis truncate txt-l font-black text-secondary'>
                    {title}
                </div>
            </div>
            <div className='flex-grow text-ellipsis px-1 txt-s' style={{wordWrap:'normal', lineBreak:'loose'}}>
                {body}

            </div>
        </div>
        :
        <div ref={ref}
            className={`right-shadow card card-compact  bg-base-100 m-object rounded-box   min-w-[6em] min-h-[6em] max-width-prose ${props.clazzName}`}
            style={{
            }}
        >
            <div
                className='drop-shadow card-title bg-primary text-center justify-center rounded-t-box text-xs text-main-light p-1 h-8 '>


            </div>
            <div className='flex grow align-middle justify-center'>

                <div className='loading loading-bars'>
                </div>
            </div>
        </div>
}
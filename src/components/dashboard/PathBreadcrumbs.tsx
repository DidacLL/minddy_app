import {Project} from "../../data/classes/dao/Project";
import React, {useEffect, useState} from "react";

export function PathBreadcrumbs(props: { path: Project[], handleClick: (project: Project) => void }) {
    const [clazzName, setClazzName] = useState<string>();

    useEffect(() => {

    }, [clazzName]);
    useEffect(() => {
        if (props.path) {
            const number = Math.round(50 / Math.max(props.path.length, 2));
            setClazzName('w-[' + number + '%] truncate overflow-hidden whitespace-nowrap');
        }
    }, [props.path]);

    return <div className="breadcrumbs w-[100%] overflow-hidden ">
        <ul className="w-[100%] font-black txt-s text-neutral flex flex-nowrap overflow-hidden ">
            {props.path?.map((el, i) => {
                    return i<props.path.length-1?<li
                        className={props.path && i < props.path.length ? clazzName : ''}>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                props.handleClick(el)
                            }
                            }
                            className='max-w-[100%] truncate overflow-hidden whitespace-nowrap'
                        >
                            {el.isRootProject() ? '_m  :' : el.name}
                        </button>
                    </li>:'';
                }
            )}
        </ul>
    </div>;
}
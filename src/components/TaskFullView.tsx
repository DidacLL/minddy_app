import {MinddyManager} from "../data/Minddy.manager";
import {ShortDate} from "./dashboard/ShortDate";
import Task from "../data/classes/dao/Task";
import ResponsiveText from "../data/classes/utils/ResponsiveText";
import {PathBreadcrumbs} from "./dashboard/PathBreadcrumbs";
import {Project} from "../data/classes/dao/Project";
import {AttributeLabel} from "./AttributeLabel";
import React, {useEffect, useRef} from "react";
import {TagBadge} from "./TagBadge";
import {Note} from "../data/classes/dao/Note";
import {ObjectContainer} from "./dashboard/ObjectContainer";


export function TaskFullView(props: {
    manager: MinddyManager,
    task: Task
}) {

    const noteContainer = useRef(null);
    const formWidth = () => props.manager.screen.isVertical() ? 'w-full' : 'w-[50%]'
    const allProjectsPath = () => {
        const path: Project | undefined = props.manager.getProject(props.task.holder);
        let retVal: Project[] = [];
        if (path) {
            const fullPath = path.getAllProjectsPath();
            for (let i = 0; i < fullPath.length; i++) {
                const p = props.manager.getProject(fullPath[i]);
                if (p) retVal.push(p)
            }
        }
        return retVal;
    }


    useEffect(() => {

    }, [props]);
    return <div className="flex flex-col w-auto h-full">

        <div className="flex flex-col  h-full">
            <div className='w-full items-start pr-4 '>
                <ResponsiveText text={<>props.task.name</>} max={120} min={30}
                                clazzName='text-base-300/80 text-left font-black uppercase'/>
            </div>
            <div className='overflow-y-scroll h-max  no-scrollbar z-20  grow'>
                {/*--------------------------------------------------------------------------------------------------BODY*/}
                <div className=' h-full w-full'>
                    <div className='float-right txt-3xl p-2 mr-2.5 text-right'>
                        {/*<span className='text-right font-extrabold font-mono text-base-300'>{props.task.state}</span>*/}
                        {props.task.date ?
                            <ShortDate date={props.task.date} text={true} clazzName='text-base-300'/> : "ASAP"}
                    </div>
                    {/*    ATTRIBUTES */}
                    <div className='px-4 inline'>
                        <AttributeLabel text={'Project'}/>
                        <div
                            className='txt-l mx-2 px-4 pb-2 mb-4 flex flex-row mask-border-bottom bg-base-300/80 rounded-box overflow-clip  justify-start font-black  align-baseline'>
                            {props.manager.screen.isHorizontal() && props.manager.screen.windowSize.width > 600 &&
                                <div className='truncate overflow-ellipsis'>
                                    <PathBreadcrumbs handleClick={(project) => {
                                    }} path={allProjectsPath()}/>
                                </div>}
                            <label className='text-neutral txt-s flex items-center ml-2'>
                                {'>'}
                                <label className='ml-2 txt-l font-black'>
                                    {props.manager.getProject(props.task.holder)?.name}
                                </label>
                            </label>
                        </div>
                        <div className=' min-w-min inline-block ' ref={noteContainer}>
                            <div className='-my-4 mx-2 pb-4 px-2 w-auto block input-group'>
                                <AttributeLabel text={'Task name'}/>
                                <div
                                    className='txt-xl w-max h-min flex flex-row justify-start font-black  align-baseline'>
                                    {props.task.name}
                                </div>
                            </div>
                            <div className={`mx-2 px-2 pb-4 inline-block input-group h-auto w-auto max-w-prose `}>
                                <AttributeLabel clazzName=' input-info select-none ' text={'Description'}/>
                                <div
                                    className='flex  max-w-full h-auto py-2 flex-row justify-start input font-thin align-baseline'>
                                    {props.task.description}
                                </div>
                            </div>
                            <div
                                className={`-mx-2 px-2 flex flex-row flex-wrap pb-4 w-auto input-group max-w-prose ${formWidth()}`}>
                                <div className='mx-2 px-2 input-group w-auto '>
                                    <AttributeLabel clazzName='inline input-info select-none' text={'State'}/>
                                    <div
                                        className='px-2 w-auto inline flex-row justify-start font-thin align-baseline'>
                                        {props.task.state}
                                    </div>
                                </div>
                                <div className='mx-2 px-2 w-auto input-group'>
                                    <AttributeLabel clazzName=' inline input-info select-none' text={'Priority'}/>
                                    <div
                                        className='px-2 inline w-auto flex-row justify-start font-thin align-baseline'>
                                        {props.task.priority}
                                    </div>
                                </div>
                                <div className='mx-2 px-2 w-auto input-group '>
                                    <AttributeLabel clazzName='px-2 inline input-info select-none' text={'Tags'}/>
                                    <div
                                        className=' rounded-box flex w-auto flex-row p-2 justify-start font-thin'>
                                        {props.task.tags.length > 0 && props.task.tags.map(t =>
                                            <TagBadge tagName={t}/>
                                        )}
                                    </div>
                                </div>
                                {noteContainer.current && <ObjectContainer<Note> label={'NOTES'}
                                                           manager={props.manager}

                                                           pageFunction={(callBack, error, size, page) =>
                                                               props.manager.getProjectNotes(callBack, error, size, page)
                                                           }
                                                           getFunction={(id, callback, error) => props.manager.getNote(id, callback, error)}
                                                           />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*----------------------------------------------------------------------------------------------------FOOTER*/}
            <div
                className="select-none text-base-100 bg-base-300 hover:bg-secondary cursor-pointer select-disabled font-bold rounded-b-box w-full "
                onClick={(e) => {
                    const p = props.manager.getProject(props.task.holder);
                    if (p) props.manager.changeCurrentProject(p)
                }}>
                {props.manager.getProject(props.task.holder)?.name}
            </div>
        </div>


    </div>;
}
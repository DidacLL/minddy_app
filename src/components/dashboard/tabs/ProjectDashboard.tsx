import {MinddyManager} from '../../../data/Minddy.manager';
import React, {useEffect, useRef, useState} from 'react';
import {Project} from '../../../data/classes/dao/Project';
import {PathBreadcrumbs} from '../PathBreadcrumbs';
import {DeadlineStats} from '../DeadlineStats';
import {EllipsisVerticalIcon, PencilSquareIcon} from '@heroicons/react/20/solid';
import Task from "../../../data/classes/dao/Task";
import {calculateDaysUntil} from "../../../data/classes/utils/Tools";
import {Note} from "../../../data/classes/dao/Note";

import {TagBadge} from "../../TagBadge";
import {AttributeLabel} from "../../AttributeLabel";
import MinddyService from "../../../data/minddy.service";
import {Tag} from "../../../data/classes/dao/Tag";
import {Trans} from "@lingui/macro";
import {ObjectContainer} from "../ObjectContainer";
import ResponsiveText from "../../../data/classes/utils/ResponsiveText";
import {useNavigate} from "react-router-dom";

export function ProjectDashboard(props: { manager: MinddyManager, project?: Project }) {

    const navigate =useNavigate();
    const [path, setPath] = useState<Project[] | undefined>();

    const [project, setProject] = useState<Project>();
    // const [todoPage, setTodoPage] = useState<PagedResponse<ObjectMinimal>>();
    const [daysMissing, setDaysMissing] = useState<number>();

    const [tags, setTags] = useState<string[]>();
    const [key, setKey] = useState(1);


    const todoContainer = useRef(null);
    const noteContainer = useRef(null);


    function assignProject() {
        if (props.project) {
            setProject(props.project)
            setPath(props.project.getAllProjectsPath().map((id) => {
                return props.manager.getProject(id) || props.manager.getRootProject();
            }))
            if (props.project.deadline) setDaysMissing(calculateDaysUntil(props.project.deadline));
            if (props.project.tags && props.project.tags.length > 0) setTags(props.project.tags);
        }
    }

    useEffect(() => {
        assignProject();
    }, [props,props.project]);


    useEffect(() => {
        assignProject()
    }, []);
    useEffect(() => {

    }, [props.manager.screen, tags]);

    return project ?
        <div className=' px-2 h-full flex-grow w-full'>
            <div className=' relative w-full '>
                {/*---------------------------------------------------------------------------FLOAT DATE*/}
                <div className='w-auto max-w-full h-auto  pl-4 float-right '>
                    <div className=' flex justify-end align-top'>
                        <div className='flex justify-end mask-frame ' data-tip={'edit..'}>
                            <div className='tooltip tooltip-bottom flex ' data-tip={'edit..'} onClick={(e)=> {
                                if (project)navigate('/project/0/'+project.id)
                            }}>
                                <PencilSquareIcon className='h-8 hover:cursor-pointer hover:text-base-300'/>
                            </div>
                            <div className='tooltip tooltip-bottom flex' data-tip={'options..'}>
                                <EllipsisVerticalIcon className='h-8 hover:cursor-pointer hover:text-base-300'/>
                            </div>
                        </div>
                    </div>
                    {project.deadline && <div>
                        <DeadlineStats daysMissing={daysMissing} deadLine={project.deadline}
                                       size={1.8}/>

                    </div>}

                </div>
                <div className='inline-block w-auto float-none '>
                    {path &&
                        <PathBreadcrumbs path={path} handleClick={(p) => navigate('/dashboard/'+p.id)}/>}
                </div>
                <div className='inline float-none items-start  h-max min-h-fill w-full max-w-full whitespace-wrap '>
                    <div className=' justify-between block mb-[1em]'>
                        <label className='txt-xl font-black '>
                            {project.isRootProject() ? new Date().toLocaleDateString() : project.name}
                        </label>
                    </div>
                    <label className='inline w-auto '>
                        Description: {project.description} {project.description} {project.description} {project.description} {project.description} {project.description} {project.description} {project.description} {project.description} {project.description} {project.description} {project.description} {project.description} {project.description}
                    </label>
                    <div className='block w-full'>
                        <div className='inline w-full'>
                            <div ref={todoContainer} className='inline-block h-auto w-full p-2'>
                                {project &&
                                    <ObjectContainer<Task> key={key}
                                                           label={'TO-DO'}
                                                           manager={props.manager}
                                                           pageFunction={(callBack, error, size, page) =>
                                                               props.manager.getProjectToDoPage(project.id,callBack, error, size, page)
                                                           }
                                                           getFunction={(id, callback, error) => {
                                                               props.manager.getTask(id, (t) => {
                                                                       callback(t);
                                                                       MinddyService.getTaskTags(props.manager.user.token,
                                                                           id,
                                                                           json => t.tags = Tag.parseTags(json).map(e => e.id),
                                                                           (e) => {
                                                                           })
                                                                   },
                                                                   error);
                                                           }}
                                                           pageSize={10}/>
                                }
                            </div>
                            <div ref={noteContainer} className='block h-auto max-w-full p-2'>
                                {project &&
                                    <ObjectContainer<Note> label={'NOTES'}
                                                           manager={props.manager}
                                                           pageFunction={(callBack, error, size, page) =>
                                                               props.manager.getProjectNotes(project.id,callBack, error, size, page)
                                                           }
                                                           getFunction={(id, callback, error) => props.manager.getNote(id, callback, error)}/>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='bg-base-300/25 rounded-box max-w-full bg-dot dot-xs-dense m-2 inline w-auto'>
                        <div className=' m-2  inline w-auto'>
                            <AttributeLabel text={'Tags'}/>
                            {project && project.tags?.length > 0 ?
                                project.tags.map(t => <label key={'tag_' + t}>
                                    <TagBadge tagName={t}
                                                                                        editMode={false}/></label>) :
                                <label><Trans> No tags</Trans></label>
                            }
                        </div>
                        <div className='m-2 inline w-auto'>
                            <AttributeLabel text={'State'}/>
                            <label> {project.state} </label>

                        </div>
                    </div>
                    <div className='stats relative grow m-4 h-fill  text-sm'>
                        <div className='stat'>
                            <div className='stat-title'>Pending tasks:</div>
                            <div onClick={() => {
                                props.manager.navigate('/dashboard/' + project?.id + '/tasks')
                            }}
                                 className='stat-value btn btn-ghost'>{project.pendingTasks}</div>
                            <div className='stat-desc'></div>
                        </div>
                        <div className='stat'>
                            <div className='stat-title'>Subprojects:</div>
                            <div onClick={() => {
                                props.manager.toggleProjectTree()
                            }}
                                 className='stat-value btn-ghost btn'>{props.manager.getProjectNode(project.id)?.accumulatedSubprojects}</div>
                            <div className='stat-desc'></div>
                        </div>
                        <div className='stat '>
                            <div className='stat-title'>Notes:</div>
                            <div onClick={() => {props.manager.navigate('/dashboard/' + project?.id + '/notes') }}
                                 className='stat-value btn-ghost btn'>
                                {project.numNotes}
                            </div>
                            <div className='stat-desc'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        :
        <div className='h-full w-full flex align-middle content-around text-center'>
            <ResponsiveText text={<div className='loading-bars'></div>} max={240} min={42}/>
        </div>
}

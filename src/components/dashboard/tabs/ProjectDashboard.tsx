import {MinddyManager} from '../../../data/Minddy.manager';
import React, {useEffect, useRef, useState} from 'react';
import {Project} from '../../../data/classes/dao/Project';
import {PathBreadcrumbs} from '../PathBreadcrumbs';
import {DeadlineStats} from '../DeadlineStats';
import {EllipsisVerticalIcon, PencilSquareIcon} from '@heroicons/react/20/solid';
import Task from "../../../data/classes/dao/Task";
import {DashboardTabs} from "../../../data/enums/DashboardTabs";
import {calculateDaysUntil} from "../../../data/classes/utils/Tools";
import {Note} from "../../../data/classes/dao/Note";

import {TagBadge} from "../../TagBadge";
import {AttributeLabel} from "../../AttributeLabel";
import MinddyService from "../../../data/minddy.service";
import {Tag} from "../../../data/classes/dao/Tag";
import {Trans} from "@lingui/macro";
import {ObjectContainer} from "../ObjectContainer";

export function ProjectDashboard(props: { manager: MinddyManager }) {
    const [path, setPath] = useState<Project[] | undefined>();

    const [project, setProject] = useState<Project>();
    // const [todoPage, setTodoPage] = useState<PagedResponse<ObjectMinimal>>();
    const [daysMissing, setDaysMissing] = useState<number>();

    const [tags, setTags] = useState<string[]>();
    const [key, setKey] = useState(1);


    const todoContainer = useRef(null);
    const noteContainer = useRef(null);


    useEffect(() => {
        try {
            setProject(props.manager.currentProject)
            setPath(props.manager.currentProject.getAllProjectsPath().map((id) => {
                return props.manager.getProject(id) || props.manager.currentProject;
            }))

        } catch (e) {
            //todo
        }
        if (props.manager.currentProject.deadLine) setDaysMissing(calculateDaysUntil(props.manager.currentProject.deadLine))
        if (project && project.tags && project.tags.length > 0) setTags(project.tags)
    }, [props.manager.currentProject]);


    useEffect(() => {
        setTags(props.manager.currentProject.tags)
    }, []);
    useEffect(() => {

    }, [props.manager.screen, tags]);
    return <div className=' px-2 h-full flex-grow w-full'>
        <div className=' relative w-full '>
            {/*---------------------------------------------------------------------------FLOAT DATE*/}
            <div className='w-auto max-w-full h-auto  pl-4 float-right '>
                <div className=' flex justify-end align-top'>
                    <div className='flex justify-end mask-frame ' data-tip={'edit..'}>
                        <div className='tooltip tooltip-bottom flex ' data-tip={'edit..'}>
                            <PencilSquareIcon className='h-8 hover:cursor-pointer hover:text-base-300'/>
                        </div>
                        <div className='tooltip tooltip-bottom flex' data-tip={'options..'}>
                            <EllipsisVerticalIcon className='h-8 hover:cursor-pointer hover:text-base-300'/>
                        </div>
                    </div>
                </div>
                {props.manager.currentProject.deadLine && <div>
                    <DeadlineStats daysMissing={daysMissing} deadLine={props.manager.currentProject.deadLine}
                                   size={1.8}/>

                </div>}

            </div>
            <div className='inline-block w-auto float-none '>
                {path &&
                    <PathBreadcrumbs path={path} handleClick={(p) => props.manager.changeCurrentProject(p)}/>}
            </div>
            <div className='inline float-none items-start  h-max min-h-fill w-full max-w-full whitespace-wrap '>
                <div className=' justify-between block mb-[1em]'>
                    <label className='txt-xl font-black '>
                        {props.manager.currentProject.isRootProject() ? new Date().toLocaleDateString() : props.manager.currentProject.name}
                    </label>
                </div>
                <label className='inline w-auto '>
                    Description: {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description} {props.manager.currentProject.description}
                </label>
                <div className='block w-full'>
                    <div className='inline w-full'>
                        <div ref={todoContainer} className='inline-block h-auto w-full p-2'>
                            {project && todoContainer.current &&
                                <ObjectContainer<Task> key={key}
                                                          label={'TO-DO'}
                                                          manager={props.manager}
                                                          pageFunction={(callBack, error, size, page) =>
                                                              props.manager.getProjectToDoPage(callBack, error, size, page)
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
                                pageSize={10}/>}
                        </div>
                        <div ref={noteContainer} className='block h-auto max-w-full p-2'>
                            {project &&
                                <ObjectContainer<Note> label={'NOTES'}
                                                          manager={props.manager}
                                                          pageFunction={(callBack, error, size, page) =>
                                                              props.manager.getProjectNotes(callBack, error, size, page)
                                                          }
                                                          getFunction={(id, callback, error) => props.manager.getNote(id, callback, error)}/>}
                        </div>
                    </div>
                </div>
                        <div className='bg-base-300/25 rounded-box max-w-full bg-dot dot-xs-dense m-2 inline w-auto'>
                            <div className=' m-2  inline w-auto'>
                                <AttributeLabel text={'Tags'}/>
                                {project && project.tags?.length > 0 ?
                                    project.tags.map(t => <label key={'tag_'+t}><TagBadge tagName={t} editMode={false}/></label>):
                                    <label><Trans> No tags</Trans></label>
                                }
                            </div>
                            <div className='m-2 inline w-auto'>
                                <AttributeLabel text={'State'}/>
                                <label> {props.manager.currentProject.state} </label>

                            </div>
                        </div>
                <div className='stats relative grow m-4 h-fill  text-sm'>
                    <div className='stat'>
                        <div className='stat-title'>Pending tasks:</div>
                        <div onClick={() => {
                            props.manager.changeDashboardTab(DashboardTabs.TASKS)
                        }}
                             className='stat-value btn btn-ghost'>{props.manager.currentProject.pendingTasks}</div>
                        <div className='stat-desc'></div>
                    </div>
                    <div className='stat'>
                        <div className='stat-title'>Subprojects:</div>
                        <div onClick={() => {
                            props.manager.minimizeProjectTree()
                        }}
                             className='stat-value btn-ghost btn'>{props.manager.getProjectNode(props.manager.currentProject.id)?.accumulatedSubprojects}</div>
                        <div className='stat-desc'></div>
                    </div>
                    <div className='stat '>
                        <div className='stat-title'>Notes:</div>
                        <div onClick={() => {
                            props.manager.changeDashboardTab(DashboardTabs.NOTES)
                        }}
                             className='stat-value btn-ghost btn'>{props.manager.currentProject.numNotes}</div>
                        <div className='stat-desc'></div>
                    </div>
                </div>
            </div>
        </div>

    </div>
}

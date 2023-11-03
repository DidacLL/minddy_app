import {MinddyManager} from "../data/Minddy.manager";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Project} from "../data/classes/dao/Project";
import {PathBreadcrumbs} from "../components/dashboard/PathBreadcrumbs";
import {MTextInput} from "../components/edit/MTextInput";
import {i18n} from "@lingui/core";
import {t} from "@lingui/macro";
import {MTextArea} from "../components/edit/MTextArea";
import {MinddyToggle} from "../components/dashboard/tabs/MinddyToggle";
import {MinddyInputGroup} from "../components/dashboard/tabs/MinddyInputGroup";
import {AttributeLabel} from "../components/AttributeLabel";
import {CogIcon, SwatchIcon, TrashIcon} from "@heroicons/react/24/outline";
import {Note} from "../data/classes/dao/Note";
import {NoteBuilder} from "../data/NoteBuilder";

export interface EditNoteProps {
    manager: MinddyManager
}

export default function EditNote(props: EditNoteProps) {

    const params = useParams();
    const navigate = useNavigate();
    const isNew = params.isNew as unknown as number > 0 || false;
    const [note, setNote] = useState<Note>();


    const [project, setProject] = useState<Project>();
    const [builder, setBuilder] = useState<NoteBuilder>();

    //------------------------------------------------------------------------------------------------------------------MOUNT
    useEffect(() => {
        try {
            const noteId = params.auxId;
            const projectId = params.projectId;
            if (noteId && !isNew) {props.manager.getNote(noteId, v=> {
                setBuilder(props.manager.noteBuilder.resetData(v))
                setNote(v)
            }, e => {
            })}else {
                setBuilder(props.manager.noteBuilder.resetData(undefined,true))
            }
            if (projectId) {
                const recoveredProject= props.manager.getProject(projectId)
                if(recoveredProject)setProject(recoveredProject)
            }
            props.manager.disableProjectTreePanel(true);
        } catch (e) {
        }
        return () => {
            try {
                props.manager.disableProjectTreePanel(false);
            } catch (e) {
            }
        }
    }, []);

    useEffect(() => {
        if(note)builder?.resetData(note, isNew)
    }, [note]);
    useEffect(() => {
        if(builder && project)builder.holder=project.id;
    }, [project]);

    return <div className='h-full w-full flex flex-col justify-between'>
        {/*HEADER                                                                    */}
        <div className='w-full h-min flex justify-between '>
            <label className='whitespace-nowrap mx-4'>Parent Project:</label>
            {builder?.holder && <PathBreadcrumbs
                path={props.manager.getProject(builder.holder)?.getAllProjectsPath()?.map(id => props.manager.getProject(id) || props.manager.getRootProject())}
                handleClick={() => {//todo
                }}/>}

            <label
                className=' z-20 btn btn-shadow btn-circle right-0 txt-l font-mono btn-sm mx-2  hover:text-opacity-60 '
                onClick={e => navigate('/dashboard/' + builder?.holder)}> x </label>
        </div>
        {/*                                 BODY                                                                    */}
        <div className='grow bg-base-100'>
            {builder && <div
                className=' grid grid-cols-[repeat(auto-fill,minmax(20em,1fr))] gap-[2rem]  h-full grid-flow-row-dense justify-center '>
                <div className='input-group-vertical'>
                    <MTextInput maxChar={30}
                                name={i18n._(t`note name`)}
                                onChange={(val: string) => {
                                    builder.name = val;
                                }}
                                tip={i18n._(t`note name tip`)}
                                placeHolder={i18n._(t`note placeholder`)}
                                initialValue={builder.name}
                    />
                    <MTextArea maxChar={180}
                               name={i18n._(t`note description`)}
                               onChange={(val: string) => {
                                   builder.body = val;
                               }}
                               tip={i18n._(t`note description tip`)}
                               placeHolder={i18n._(t`description placeholder`)}
                               initialValue={builder.body}
                    />
                </div>
                <div className='z-10 input-group-vertical relative'>


                </div>
                <div>
                    <MinddyToggle onClick={(e) => {
                    }} value={true} text={'pinned'}/>
                    <MinddyToggle onClick={(e) => {
                    }} value={true} text={'favourite'}/>
                </div>
            </div>
            }
        </div>

        {/*                                 FOOTER                                                                    */}
        <div className='w-full h-min min-h-12 flex'>
            <div className='input-group  flex justify-between'>

                <MinddyInputGroup
                    child={[
                        <AttributeLabel text={'Discard changes'} clazzName='txt-mb m-2'/>,
                        <TrashIcon className='btn btn-circle p-1 m-1 btn-sm btn-shadow'/>]}
                />
                <MinddyInputGroup
                    child={[
                        <AttributeLabel text={''} clazzName='txt-mb m-2'/>,
                        <SwatchIcon className='btn btn-circle  p-1 m-1 btn-sm btn-shadow'/>]}
                />
                <div onClick={saveTask}>
                    <MinddyInputGroup
                        child={[
                            <AttributeLabel text={i18n._('save')} clazzName='txt-mb m-2'/>,
                            <CogIcon className='btn btn-circle p-1 m-1   btn-sm btn-shadow'/>
                        ]}

                    />
                </div>

            </div>
        </div>
        {/*<div className=' h-full w-full'>*/}
        {/*</div>*/}
    </div>

    function saveTask() {
        if (builder && builder.isFullFilled())
            isNew ? props.manager.newNote(builder.build(), (v) => {
                    props.manager.updateAllData(
                        ignored => navigate('/dashboard/' + builder.holder));
                })
                : props.manager.updateNote(builder.build(), (v) => {
                        props.manager.updateAllData(
                            ignored => navigate('/dashboard/' + builder.holder));
                    }
                );
    }

}
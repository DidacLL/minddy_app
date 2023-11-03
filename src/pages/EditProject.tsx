import {MinddyManager} from "../data/Minddy.manager";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {PathBreadcrumbs} from "../components/dashboard/PathBreadcrumbs";
import {t} from "@lingui/macro";
import {MTextInput} from "../components/edit/MTextInput";
import {i18n} from "@lingui/core";
import {MTextArea} from "../components/edit/MTextArea";
import {EnumSelector} from "./EnumSelector";
import {ProjectState, ProjectStateNames} from "../data/enums/ProjectState";
import {MinddyInputGroup} from "../components/dashboard/tabs/MinddyInputGroup";
import {MinddyToggle} from "../components/dashboard/tabs/MinddyToggle";
import {DateSelector} from "../components/edit/DateSelector";
import {DeadlineStats} from "../components/dashboard/DeadlineStats";
import {calculateDaysUntil} from "../data/classes/utils/Tools";
import {CogIcon, SwatchIcon, TrashIcon} from "@heroicons/react/24/outline";
import {AttributeLabel} from "../components/AttributeLabel";
import {Project} from "../data/classes/dao/Project";
import {ProjectBuilder} from "../data/ProjectBuilder";

export interface EditProjectProps {
    manager: MinddyManager
}

export default function EditProject(props: EditProjectProps) {
    const params = useParams();
    const navigate = useNavigate();
    const isNew = params.isNew as unknown as number > 0 || false;
    const [project, setProject] = useState<Project>(props.manager.getProject(params.projectId || '') || props.manager.getRootProject());
    const [builder, setBuilder] = useState<ProjectBuilder>(props.manager.projectBuilder.resetData(project, isNew));

    //------------------------------------------------------------------------------------------------------------------MOUNT
    useEffect(() => {
        try {
            props.manager.disableProjectTreePanel(true);
            builder.resetData(project, isNew)
        } catch (e) {
        }
        return () => {
            try {
                props.manager.disableProjectTreePanel(false);
            } catch (e) {
            }
        }
    }, []);
    //------------------------------------------------------------------------------------------------------------------PROJECT

    return <div className='h-full w-full flex flex-col justify-between'>
        {/*HEADER                                                                    */}
        <div className='w-full h-min flex justify-between '>
            <label className='whitespace-nowrap mx-4'>Parent Project:</label>
            {project && <PathBreadcrumbs
                path={project.getAllProjectsPath()?.map(id => props.manager.getProject(id) || props.manager.getRootProject())}
                handleClick={() => {//todo
                }}/>}

            <label
                className=' z-20 btn btn-shadow btn-circle right-0 txt-l font-mono btn-sm mx-2  hover:text-opacity-60 '
                onClick={e => navigate('/dashboard/' + project.id)}> x </label>
        </div>
        {/*                                 BODY                                                                    */}
        <div className='grow bg-base-100'>
            {project && <div
                className=' grid grid-cols-[repeat(auto-fill,minmax(20em,1fr))] gap-[2rem]  h-full grid-flow-row-dense justify-center '>
                <div className='input-group-vertical'>
                    <MTextInput maxChar={30}
                                name={i18n._(t`Project name`)}
                                onChange={(val: string) => {
                                    builder.name = val;
                                }}
                                tip={i18n._(t`project name tip`)}
                                placeHolder={i18n._(t`project placeholder`)}
                                initialValue={builder.name}
                    />
                    <MTextArea maxChar={180}
                               name={i18n._(t`Project description`)}
                               onChange={(val: string) => {
                                   builder.description = val;
                               }}
                               tip={i18n._(t`project description tip`)}
                               placeHolder={i18n._(t`description placeholder`)}
                               initialValue={builder.description}
                    />
                </div>
                <div className='z-10 input-group-vertical relative'>
                    {/*<div*/}
                    {/*    className='absolute -z-10 rotate-180 origin-center mask-frame bg-base-200 opacity-50 bg-dot dot-s text-base-300  w-full h-full '></div>*/}
                    {/*<EnumSelector<Priority> names={Object.values(PriorityNames)}*/}
                    {/*                        onChange={(v) => {*/}
                    {/*                            */}
                    {/*                        }} title={i18n._(t`Priority`)}*/}
                    {/*                        values={Object.values(Priority) as Priority[]}*/}
                    {/*                        tip={'Select the current priority for this project'}*/}
                    {/*                        initialValue={Priority.NORMAL}*/}

                    {/*/>*/}
                    {project && <EnumSelector<ProjectState> names={Object.values(ProjectStateNames)}
                                                            onChange={(v) => {
                                                                builder.state = v;
                                                            }}
                                                            title={i18n._(t`Project State`)}
                                                            values={Object.values(ProjectState) as ProjectState[]}
                                                            initialValue={builder.state}
                                                            tip={'Select the current state for this project'}/>}

                </div>
                <div>
                    <MinddyToggle onClick={(e) => {
                    }} value={true} text={'pinned'}/>
                    <MinddyToggle onClick={(e) => {
                    }} value={true} text={'favourite'}/>
                </div>
                <div>
                    {builder && (builder.deadline instanceof Date) &&
                        <DeadlineStats daysMissing={calculateDaysUntil(builder.deadline)}
                                       deadLine={builder.deadline}/>}
                    <DateSelector title={'Deadline'} onChange={
                        (d) => builder.deadline = d
                    }
                                  initialValue={builder.deadline}/>
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
                <div onClick={saveProject}>
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

    function saveProject() {
        if (builder.isFullFilled())
            isNew ? props.manager.newProject(builder.build(), (v) => {
                    props.manager.updateAllData(
                        ignored => navigate('/dashboard/' + v.ownerID + v.projectID));
                })
                : props.manager.updateProject(builder.build(), (v) => {
                        props.manager.updateAllData(
                            ignored => navigate('/dashboard/' + v.ownerID + v.projectID));
                    }
                );
    }

}
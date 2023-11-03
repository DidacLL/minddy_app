import {ProjectNode} from '../../data/classes/dto/ProjectNode';
import React from 'react';
import {ArchiveBoxArrowDownIcon, ArchiveBoxIcon} from '@heroicons/react/20/solid';
import {MinddyToggle} from "../dashboard/tabs/MinddyToggle";
import {i18n} from "@lingui/core";

export function TreeTab(props: {
    root: ProjectNode,
    open: boolean,
    showAll:boolean,
    selectTab: (e: any) => void,
    handleToggle: (b:boolean) => void,
    rest: React.JSX.Element | undefined
}) {

    return <div className={`flex card  ${props.root.isRootProject() ? 'flex-grow h-full ' : ' pb-2'}`}>

        <div className='h-full'>
            {/*TITLE BAR! */}
            <div
                className={`justify-between overflow-hidden min-w-prose card-title font-bold  ${props.root.isRootProject() ?
                    ('')
                    :
                    (props.open ?
                            ('rounded-tr-box p-2 bg-secondary text-secondary-content mt-2 force-shadow-in ')
                            :
                            ('bg-base-100 mb-2 p-2 hover:text-neutral mt-2 btn-shadow rounded-box  hover:scale-[98%]')
                    )}`
                }
                onClick={props.selectTab}>
                {!props.root.isRootProject() ? props.open ?
                        <ArchiveBoxArrowDownIcon className='mask-border-y h-4'/>
                        :
                        <ArchiveBoxIcon className='h-4'/>
                    : ''}
                <label
                    className=' z-0 text-ms overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-left px-2  flex-grow '>
                    {props.root.isRootProject() ? '' : props.root.project.name}
                </label>
                {props.root.isRootProject() ? '' :
                    <label className={`badge badge-xs ${props.open ? 'badge-accent' : 'badge-primary'}`}></label>}
            </div>
            {props.rest}
        </div>
        {props.root.isRootProject() &&
            <div className='form-control w-full bg-transparent h-auto text-xs justify-start flex start-0'>
                <div className='flex m-2'>
                    <MinddyToggle
                        onClick={() =>
                            props.handleToggle(!props.showAll)
                        }
                        value={props.showAll}
                        text={i18n._('View all projects?')}/>
                </div>

            </div>}
    </div>;
}
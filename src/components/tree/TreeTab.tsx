import {ProjectNode} from '../../data/classes/dto/ProjectNode';
import React from 'react';
import {ArchiveBoxArrowDownIcon, ArchiveBoxIcon} from '@heroicons/react/20/solid';
import {Trans} from '@lingui/macro';

export function TreeTab(props: {
    root: ProjectNode,
    open: boolean,
    selectTab: (e: any) => void,
    handleToggle: (b: boolean) => void,
    rest: React.JSX.Element | undefined
}) {

    return <div className={`flex card  ${props.root.isRootProject() ? 'h-full':' pb-2'}`}>
        {/*TITLE BAR! */}
        <div className={`justify-between overflow-hidden min-w-prose card-title ${props.root.isRootProject()?
            ('')
            :
            (props.open ?
                ('rounded-tr-box p-2 bg-primary mt-2 force-shadow-in text-base-100 ')
                :
                ('bg-base-100 mb-2 p-2 hover:text-neutral mt-2 btn-shadow rounded-box bg-base hover:scale-[98%]')
            )}`
        }
             onClick={props.selectTab}>
            {!props.root.isRootProject() ? props.open ?
                    <ArchiveBoxArrowDownIcon className='h-4'/>
                    :
                    <ArchiveBoxIcon className='h-4'/>
                : ''}
            <label
                className='text-ms overflow-hidden overflow-ellipsis whitespace-nowrap text-primary-content text-sm text-left px-2  flex-grow'>
                {props.root.isRootProject() ? '' : props.root.project.name}
            </label>
            {props.root.isRootProject() ? '' :
                <label className={`badge badge-xs ${props.open ? 'badge-accent' : 'badge-primary'}`}></label>}
        </div>
        {props.rest}
        {props.root.isRootProject() &&
            <div className='form-control w-full text-xs'>
                <label className='label cursor-pointer'>
                    <span className='label-text'><Trans> View all projects</Trans>: </span>
                    <input type='checkbox' className='toggle-sm toggle'
                           onChange={(event) => props.handleToggle(event.currentTarget.checked)}/>
                </label>
            </div>}
    </div>;
}
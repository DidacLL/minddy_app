import {MinddyManager} from "../../../data/Minddy.manager";
import {SquaresPlusIcon} from "@heroicons/react/20/solid";
import React, {useEffect, useState} from "react";
import Task from "../../../data/classes/dao/Task";
import {PagedResponse} from "../../../data/classes/dto/PagedResponse";
import {ObjectTable} from "../ObjectTable";
import {MinddyToggle} from "./MinddyToggle";
import {Project} from "../../../data/classes/dao/Project";
import {i18n} from "@lingui/core";


export function ProjectTasks(props: { manager: MinddyManager , project?: Project }) {
    const [currentPage, setCurrentPage] = useState<PagedResponse<Task>>();
    const [project, setProject] = useState<Project>();
    const [isPaged, setIsPaged] = useState(true);
    const [content, setContent] = useState<React.JSX.Element>();
    const [viewAll, setViewAll] = useState(false);
    const [viewSubprojects, setViewSubprojects] = useState(true);
    useEffect(() => {
        setProject(props.project)
    }, []);
    useEffect(() => {
        setProject(props.project)
    }, [viewAll, viewSubprojects,props.project]);

    useEffect(() => {
        loadPage(0)
    }, [project]);
    useEffect(() => {
        let ot =objectTable()
        if(ot)setContent(ot);
    }, [currentPage]);


    function loadPage(num?: number) {
        if(project)props.manager.getProjectTasks(project.id, res => setCurrentPage(res), (e) => {
            console.log(e)
        }, 10, num || 0, viewAll, viewSubprojects);
    }

    const objectTable = () => {
        if (currentPage) return <ObjectTable<Task> objects={currentPage.content} manager={props.manager}/>
    };
    return <div className='flex flex-col p-2  flex-grow w-full '>
        <div className='flex flex-row justify-between w-[100%] flex-grow  overflow-hidden '>
            <div className='flex flex-col flex-grow justify-between min-h-full overflow-hidden   '>
                {/*_________OPTIONS____________*/}
                <div>

                    <MinddyToggle onClick={() => setViewSubprojects(!viewSubprojects)} value={viewSubprojects}
                                  text={i18n._(`Show subprojects`)}/>
                    <MinddyToggle onClick={() => setViewAll(!viewAll)} value={viewAll}
                                  text={i18n._('Show Closed')}/>
                </div>
                <div className='grow'>
                    {content}
                </div>
            </div>
            <div className='max-w-fit grow pl-4 '>
                <div className=' flex justify-end align-top'>
                        <div className='tooltip tooltip-left flex' data-tip={'new task'}>
                            <SquaresPlusIcon
                                className='h-7 hover:cursor-pointer hover:bg-transparent hover:text-primary'/>
                        </div>
                </div>


            </div>
        </div>
    </div>;
}
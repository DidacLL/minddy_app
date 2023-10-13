import {MinddyManager} from "../../../data/Minddy.manager";
import {SquaresPlusIcon} from "@heroicons/react/20/solid";
import React, {useEffect, useState} from "react";
import Task from "../../../data/classes/dao/Task";
import {Trans} from "@lingui/macro";
import {PagedResponse} from "../../../data/classes/dto/PagedResponse";
import {ObjectTable} from "../ObjectTable";
import {MinddyToggle} from "./MinddyToggle";


export function ProjectTasks(props: { manager: MinddyManager }) {
    const [currentPage, setCurrentPage] = useState<PagedResponse<Task>>();
    const [isPaged, setIsPaged] = useState(true);
    const [content, setContent] = useState<React.JSX.Element>();
    const [viewAll, setViewAll] = useState(false);
    const [viewSubprojects, setViewSubprojects] = useState(true);
    useEffect(() => {
        loadPage(0)
    }, [viewAll, viewSubprojects, props.manager.currentProject]);

    useEffect(() => {
        loadPage(0);
    }, []);
    useEffect(() => {
        let ot =objectTable()
        if(ot)setContent(ot);
    }, [currentPage]);

    useEffect(() => {
        let ot =objectTable()
        if(ot)setContent(ot);
    }, [currentPage]);


    function loadPage(num?: number) {
        props.manager.getCurrentProjectTasks(res => setCurrentPage(res), (e) => {
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
                                  text={<Trans>Show subprojects</Trans>}/>
                    <MinddyToggle onClick={() => setViewAll(!viewAll)} value={viewAll}
                                  text={<Trans>Show Closed</Trans>}/>
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
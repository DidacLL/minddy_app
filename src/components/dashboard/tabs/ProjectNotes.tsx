import {MinddyManager} from "../../../data/Minddy.manager";
import React, {useEffect, useState} from "react";
import {PagedResponse} from "../../../data/classes/dto/PagedResponse";
import {Note} from "../../../data/classes/dao/Note";
import {ObjectTable} from "../ObjectTable";
import {DocumentPlusIcon} from "@heroicons/react/20/solid";
import {ObjectMinimal} from "../../../data/classes/dto/ObjectMinimal";
import {Project} from "../../../data/classes/dao/Project";

export function ProjectNotes(props: { manager: MinddyManager, project?: Project  }) {
    const [currentPage, setCurrentPage] = useState<PagedResponse<ObjectMinimal>>();
    const [project, setProject] = useState<Project>();
    const [objects, setObjects] = useState<Note[]>([]);
    const [content, setContent] = useState<React.JSX.Element>();
    useEffect(() => {
        setProject(project)
        loadPage(0);
    }, []);

    useEffect(() => {
        // setObjects([])
        setProject(props.project)
        loadPage(0)
    }, [ props.project]);
    useEffect(() => {
        if(currentPage) {
            setObjects([])
            for (let i = 0; i < currentPage.numberOfElements; i++) {
                let n = currentPage.content.at(i);
                if(n){
                    props.manager.getNote(n.id,(note)=>{
                        setObjects(objects.concat(note));
                    },(e)=>{
                        console.log(e)})
                }
            }
            let ot = objectTable()
            if (ot) setContent(ot);
        }
    }, [currentPage]);


    useEffect(() => {
    }, [objects]);


    function loadPage(num?: number) {
        project && props.manager.getProjectNotes(project.id,res => setCurrentPage(res), (e) => {
            console.log(e)
        }, 10, num || 0);
    }

    const objectTable = () => {
        if (currentPage) return <ObjectTable<Note> objects={objects} manager={props.manager}/>
    };
    return <div className='flex flex-col p-2  flex-grow w-full '>
        <div className='flex flex-row justify-between w-[100%] flex-grow  overflow-hidden '>
            <div className='flex flex-col flex-grow justify-between min-h-full overflow-hidden   '>
                {/*_________OPTIONS____________*/}
                <div className='grow'>

                    {content}
                </div>
            </div>
            <div className='max-w-fit grow pl-4 '>
                <div className=' flex justify-end align-top'>
                    <div className='flex justify-end '>
                        <div className='tooltip tooltip-left flex' data-tip={'new note'}>
                            <DocumentPlusIcon
                                className='h-7 hover:cursor-pointer hover:bg-transparent hover:text-primary'/>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    </div>;
}
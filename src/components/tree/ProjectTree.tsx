import React, {useEffect, useState} from "react";
import {MinddyManager} from "../../data/Minddy.manager";
import {ProjectNode} from "../../data/classes/ProjectNode";
import {TreeTab} from "./TreeTab";
import {Project, ProjectState} from "../../data/classes/bussiness/Project";
import {Trans} from "@lingui/macro";

interface ProjectTreeProps {
    manager: MinddyManager;
    // expandible: boolean;
}

export function ProjectTree(props: ProjectTreeProps) {

    const [viewAll, setViewAll] = useState(false);
    const [openProject, setOpenProject] = useState(props.manager.currentProject || undefined);
    props.manager.updateTree = (project: Project) => setOpenProject(project)
    useEffect(() => {
        if (!openProject && props.manager.currentProject && props.manager.currentProject !== openProject) {
            setOpenProject(props.manager.currentProject)
        }
    }, [props.manager.currentProject]);
    useEffect(() => {
        if (openProject && props.manager.currentProject !== openProject) {
            props.manager.changeCurrentProject(openProject);
        }
    }, [openProject]);

    useEffect(() => {

    }, [viewAll]);

    function handleTitleClick(event: React.MouseEvent, root: ProjectNode) {
        if (openProject) {
            if (openProject === root.project) {
                const aux = props.manager.structure.getNodeById(root.project.getParentID());
                if (aux) return setOpenProject(aux.project);
            }
        }
        setOpenProject(root.project);
    }

    function constructProjectTabs(root: ProjectNode) {
        if (openProject) {
            let rest: React.JSX.Element | undefined;
            const path = openProject.getAllProjectsPath();
            const open = path.includes(root.project.id);
            if (open && root.hasChild()) {
                rest = root.isRootProject() ?
                    // TREE BACKGROUND
                    <div className='  rounded-r-box mb-2 center-shadow-in p-4 flex-grow  h-full bg-base-300 '>
                        <div className={` overflow-y-scroll no-scrollbar h-full flex flex-col text-right`}>
                            {root.subProjects.map((el) => {
                                // @ts-ignore
                                if (!viewAll && (el.project.state && (ProjectState.COMPLETE === ProjectState[el.project.state.valueOf()] || ProjectState.DISCARDED === ProjectState[el.project.state.valueOf()]))) {
                                    return '';
                                }
                                return constructProjectTabs(el)
                            })}
                        </div>
                    </div>
                    //TREE TAB BODY
                    : <div className={`bg-base-200 shadow rounded-br-box mb-2 ml-2 flex flex-col text-right  `}>
                        {root.subProjects.map((el) => {
                            // @ts-ignore
                            if (!viewAll && (el.project.state && (ProjectState.COMPLETE === ProjectState[el.project.state.valueOf()] || ProjectState.DISCARDED === ProjectState[el.project.state.valueOf()]))) {
                                return '';
                            }
                            return constructProjectTabs(el)
                        })}
                    </div>
            }
            return <TreeTab root={root}
                            open={open}
                            selectTab={(e) => handleTitleClick(e, root)}
                            handleToggle={(b: boolean) => setViewAll(b)}
                            rest={rest}/>
        }
        return <label><Trans>LOADING...</Trans></label>
    }

    return <div className="flex-grow bg-primary h-full">
        {props.manager.structure && constructProjectTabs(props.manager.structure.root)}
    </div>
}
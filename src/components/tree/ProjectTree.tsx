import React, {useEffect, useState} from "react";
import {AppData} from "../../data/classes/AppData";
import {ProjectNode} from "../../data/classes/ProjectNode";
import {TreeTab} from "./TreeTab";
import {Project, ProjectState} from "../../data/classes/bussiness/Project";
import {Trans} from "@lingui/macro";

interface ProjectTreeProps {
    appData: AppData;
    // expandible: boolean;
}

export function ProjectTree(props: ProjectTreeProps) {

    const [viewAll, setViewAll] = useState(false);
    const [openProject, setOpenProject] = useState(props.appData.currentProject || undefined);
    props.appData.updateTree = (project: Project) => setOpenProject(project)
    useEffect(() => {
        if (!openProject && props.appData.currentProject && props.appData.currentProject !== openProject) {
            setOpenProject(props.appData.currentProject)
        }
    }, [props.appData.currentProject]);
    useEffect(() => {
        if (openProject && props.appData.currentProject !== openProject) {
            props.appData.changeCurrentProject(openProject);
        }
    }, [openProject]);

    useEffect(() => {

    }, [viewAll]);

    function handleTitleClick(event: React.MouseEvent, root: ProjectNode) {
        if (openProject) {
            if (openProject === root.project) {
                const aux = props.appData.structure.getNodeById(root.project.getParentID());
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
                    <div className='  rounded-r-box mb-2 center-shadow-in p-4 flex-grow  h-full bg-base-300 '>
                        <div className={` overflow-y-scroll no-scrollbar h-full`}>
                            {root.subProjects.map((el) => {
                                // @ts-ignore
                                if (!viewAll && (el.project.state && (ProjectState.COMPLETE === ProjectState[el.project.state.valueOf()] || ProjectState.DISCARDED === ProjectState[el.project.state.valueOf()]))) {
                                    return '';
                                }
                                return constructProjectTabs(el)
                            })}
                        </div>
                    </div>

                    : <div className={`pr-0.5 bg-base-100 rounded-br-box mb-2 ml-2`}>
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
        {props.appData.structure && constructProjectTabs(props.appData.structure.root)}
    </div>
}
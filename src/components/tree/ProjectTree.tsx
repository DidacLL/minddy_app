import React, {useEffect, useState} from "react";
import {MinddyManager} from "../../data/Minddy.manager";
import {ProjectNode} from "../../data/classes/dto/ProjectNode";
import {TreeTab} from "./TreeTab";
import {Project} from "../../data/classes/dao/Project";
import {Trans} from "@lingui/macro";
import {useNavigate, useParams} from "react-router-dom";
import {ProjectState} from "../../data/enums/ProjectState";

interface ProjectTreeProps {
    manager: MinddyManager;
    // expandible: boolean;
}

export function ProjectTree(props: ProjectTreeProps) {
    let params = useParams();
    const [viewAll, setViewAll] = useState(false);
    const [openProject, setOpenProject] = useState<Project>();
    const navigate= useNavigate()

    function assignStatesFromParams() {
        if (params.projectId) {
            const project = props.manager.getProject(params.projectId.toUpperCase())
            if (project) {
                setOpenProject(project)
                return;
            }
        }
        setOpenProject(props.manager.getRootProject())
    }

    useEffect(() => {
        if (openProject) {
            navigate('/dashboard/'+openProject.id);
        }
    }, [openProject, props.manager]);

    useEffect(() => {

    }, [viewAll]);
    useEffect(() => {
        assignStatesFromParams();
    }, [params,params.projectId]);

    useEffect(() => {
        assignStatesFromParams();
    }, []);
    function handleTitleClick(event: React.MouseEvent, root: ProjectNode) {
        if (openProject) {
            if (openProject === root.project) {
                const aux = props.manager.getProjectNode(root.project.getParentID());
                if (aux) return setOpenProject(aux.project);
            }
        }
        setOpenProject(root.project);
    }

    function constructProjectTabs(root: ProjectNode,index:number=0) {
        if (openProject) {
            let rest: React.JSX.Element | undefined;
            const path = openProject.getAllProjectsPath();
            const open = path.includes(root.project.id);
            if (open && root.hasChild()) {
                rest = root.isRootProject() ?
                    // TREE BACKGROUND
                    <div key={'body_'+root.project.id} className='  rounded-r-box mb-2 center-shadow-in p-4 flex-grow  h-full bg-base-300 text-base-200/50 bg-dot dot-xs-wide  '>
                        <div key={'body_in_'+root.project.id} className={` overflow-y-scroll no-scrollbar h-full flex flex-col text-right`}>
                            {root.subProjects.map((el,index) => {
                                // @ts-ignore
                                if (!viewAll && (el.project.state && (ProjectState.COMPLETE === ProjectState[el.project.state.valueOf()] || ProjectState.DISCARDED === ProjectState[el.project.state.valueOf()]))) {
                                    return <div key={'sub_'+el.project.id}></div>;
                                }
                                return constructProjectTabs(el,index)
                            })}
                        </div>
                    </div>
                    //TREE TAB BODY
                    : <div key={'tab_'+root.project.id}  className={`bg-base-200 shadow rounded-br-box mb-2 ml-2 flex flex-col text-right  `}>
                        {root.subProjects.map((el,index) => {
                            // @ts-ignore
                            if (!viewAll && (el.project.state && (ProjectState.COMPLETE === ProjectState[el.project.state.valueOf()] || ProjectState.DISCARDED === ProjectState[el.project.state.valueOf()]))) {
                                return <div key={'tree_'+el.project.id}></div>;
                            }
                            return constructProjectTabs(el,index)
                        })}
                    </div>
            }
            return <TreeTab key={'tree_tab_'+root.project.id} root={root}
                            open={open}
                            selectTab={(e) => handleTitleClick(e, root)}
                            handleToggle={(b:boolean) => setViewAll(b)}
                            rest={rest} showAll={viewAll}/>
        }
        return <label><Trans>LOADING...</Trans></label>
    }

    return <div key={'full_tree_'+new Date().getMilliseconds()}  className="flex-grow h-full flex flex-col justify-between overflow-auto no-scrollbar">
        {constructProjectTabs(props.manager.getRootProjectNode())}
    </div>
}
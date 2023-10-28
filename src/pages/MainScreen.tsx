import {MinddyManager} from "../data/Minddy.manager";
import React, {MutableRefObject, useEffect, useState} from "react";
import {Project} from "../data/classes/dao/Project";
import {ProjectDashboard} from "../components/dashboard/tabs/ProjectDashboard";
import {ProjectTasks} from "../components/dashboard/tabs/ProjectTasks";
import {Trans} from "@lingui/macro";
import {DashboardTabs} from "../data/enums/DashboardTabs";
import {ProjectNotes} from "../components/dashboard/tabs/ProjectNotes";
import {FullPageModal} from "../components/FullScreenModal";
import {useNavigate, useParams} from "react-router-dom";


export function MainScreen(props: { manager: MinddyManager, tab?: DashboardTabs, viewToday?: boolean }) {
    const navigate= useNavigate();
    let params = useParams();
    const [currentProject, setCurrentProject] = useState<Project>();
    const [projectTab, setProjectTab] = useState<DashboardTabs>();
    const [modal, setModal] = useState<MutableRefObject<HTMLDialogElement | null>>();
    const [modalContent, setModalContent] = useState<React.JSX.Element>();

    function assignStatesFromParams() {
        if (params.projectId) {
            const project = props.manager.getProject(params.projectId.toUpperCase())
            if (project) {
                if (project.isLoaded) {
                    project && setCurrentProject(project)
                } else {
                    project.load(props.manager.user.token, () => setCurrentProject(project))
                }
            }
        }else{
            setCurrentProject(props.manager.getRootProject())
        }
        switch(params.tab?.toLowerCase()){
            case 'tasks':setProjectTab(DashboardTabs.TASKS)
                break;
            case 'notes':setProjectTab(DashboardTabs.NOTES)
                break;
            default: setProjectTab(DashboardTabs.DASHBOARD)
        }
    }
    useEffect(() => {

    }, []);

    useEffect(() => {

    }, [modalContent, props.manager.screen]);
    useEffect(() => {
        props.manager.openModal = (body: React.JSX.Element) => {
            setModalContent(body)
            modal?.current?.showModal()
        }
    }, [modal]);

    useEffect(() => {
        assignStatesFromParams();
    }, [params]);
    useEffect(() => {
    }, [currentProject,projectTab,currentProject]);

    function renderTabContent() {
        switch (projectTab) {
            case  DashboardTabs.TASKS:
                return <ProjectTasks manager={props.manager} project={currentProject}/>
            case  DashboardTabs.NOTES:
                return <ProjectNotes manager={props.manager} project={currentProject}/>
            default:
                return <ProjectDashboard manager={props.manager} project={currentProject}/>
        }
    }

    const percent = Math.floor(100 / Math.max(1, Object.keys(DashboardTabs).length / 2));
    return currentProject?

        <div key={params.projectId +'_'+ params.tab} className=' flex flex-col grow overflow-y-scroll rounded-l-box no-scrollbar'>
            <FullPageModal getRef={(v) => {
                setModal(v)
            }} content={modalContent}/>
            <div className="">
                <div className="navbar-start"></div>
                <div className="tabs navbar-center w-full mt-0 ">
                    <div
                        className={`tab tab-sm txt-sb tab-lifted tab-border-none rounded-t-box w-[${percent}%] text-left ${projectTab === DashboardTabs.DASHBOARD ? 'tab-active  ' : 'bg-base-300 bg-dot dot-s text-base-200/50'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/dashboard/'+params.projectId?.toLowerCase())
                        }}>
                        <label
                            className={` w-full text-left px-2 font-bold ${projectTab === DashboardTabs.DASHBOARD ? ' text-base-content' : 'text-base-content/20'}`}>
                            <Trans>Dashboard</Trans>
                        </label>
                    </div>
                    <div
                        className={`tab tab-sm txt-sb  tab-lifted tab-border-none  w-[${percent}%] ${projectTab === DashboardTabs.TASKS ? 'tab-active ' : 'bg-base-300 bg-dot dot-s text-base-200/50'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/dashboard/'+params.projectId?.toLowerCase()+'/tasks')
                        }}>
                        <label
                            className={`w-full text-left px-2 font-bold ${projectTab === DashboardTabs.TASKS ? ' text-base-content' : 'text-base-content/20'}`}>
                            <Trans>Tasks</Trans>
                        </label>
                    </div>
                    <div
                        className={`tab tab-sm txt-sb  tab-lifted tab-border-none  w-[${percent}%] ${projectTab === DashboardTabs.NOTES ? 'tab-active ' : 'bg-base-300 bg-dot dot-s text-base-200/50'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/dashboard/'+params.projectId?.toLowerCase()+'/notes')
                        }}>
                        <label
                            className={`w-full text-left px-2 font-bold ${projectTab === DashboardTabs.NOTES ? ' text-base-content' : 'text-base-content/20'}`}>
                            <Trans>Notes</Trans>
                        </label>
                    </div>
                </div>
                <div className="navbar-end"></div>
            </div>
            <div className="  flex flex-col flex-nowrap p-2 bg-base-100 w-full flex-grow rounded-tr-box ">
                {renderTabContent()}
            </div>
        </div>
        :
        <div className=" flex align-middle h-[100%] w-[100%] justify-center ">
            <div className="justify-center flex w-64 ">
                <div className="align-middle loading loading-ball loading-md "/>
                <div className="align-middle loading loading-ball loading-sm "/>
                <div className="align-middle loading loading-ball loading-md "/>

            </div>
        </div>

}
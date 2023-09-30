import {MinddyManager} from "../data/Minddy.manager";
import React, {useEffect, useState} from "react";
import {Project} from "../data/classes/dao/Project";
import {ProjectDashboard} from "../components/dashboard/tabs/ProjectDashboard";
import {ProjectTasks} from "../components/dashboard/tabs/ProjectTasks";
import {Trans} from "@lingui/macro";
import {DashboardTabs} from "../data/enums/DashboardTabs";
import {ProjectNotes} from "../components/dashboard/tabs/ProjectNotes";

export function MainScreen(props: { manager: MinddyManager }) {
    const [selectedProject, setSelectedProject] = useState(props.manager?.currentProject ? props.manager.currentProject : null);
    const [projectTab, setProjectTab] = useState(DashboardTabs.DASHBOARD);

    useEffect(() => {
        if(selectedProject){
            props.manager.changeCurrentProject(selectedProject)
        }
    }, [selectedProject]);
    useEffect(() => {
        props.manager.changeDashboard = (p: Project) => setSelectedProject(p)
    }, [props.manager]);
    useEffect(() => {
        props.manager.changeDashboardTab=(tab:DashboardTabs)=>setProjectTab(tab)
    }, []);
    function renderTabContent() {
        switch (projectTab) {
            case  DashboardTabs.TASKS:
                return <ProjectTasks manager={props.manager}/>
            case  DashboardTabs.NOTES:
                return <ProjectNotes manager={props.manager}/>
            default:
                return <ProjectDashboard manager={props.manager}/>
        }
    }

        return props.manager && selectedProject ?

            <div className='flex flex-col grow overflow-y-scroll rounded-l-box no-scrollbar ' >
                <div className="">
                    <div className="navbar-start"></div>
                    <div className="tabs navbar-center w-[100%]  mt-0 bg-base-300">
                        <div className={`tab tab-sm tab-lifted tab-border-none w-[30%] ${projectTab === DashboardTabs.DASHBOARD ? 'tab-active ' : 'bg-base-300 text-base-content/25'}`}
                           onClick={(e) => {
                               e.preventDefault();
                               setProjectTab( DashboardTabs.DASHBOARD)
                           }}><Trans>Dashboard</Trans></div>
                        <div className={`tab tab-sm tab-lifted w-[30%] ${projectTab ===  DashboardTabs.TASKS ? 'tab-active ' : 'bg-base-300 text-base-content/25'}`}
                           onClick={(e) => {
                               e.preventDefault();
                               setProjectTab( DashboardTabs.TASKS)
                           }}><Trans>Tasks</Trans></div>
                        <div className={`tab tab-sm tab-lifted w-[30%] ${projectTab ===  DashboardTabs.NOTES ? ' tab-active' : 'bg-base-300 text-base-content/25'}`}
                           onClick={(e) => {
                               e.preventDefault();
                               setProjectTab( DashboardTabs.NOTES)
                           }}><Trans>Notes</Trans></div>
                    </div>
                    <div className="navbar-end"></div>
                </div>
                <div className=" flex flex-col flex-nowrap p-2 bg-base-100 w-[100%] flex-grow rounded-tr-box " >
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
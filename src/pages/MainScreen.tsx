import {AppData} from "../data/classes/AppData";
import React, {useEffect, useState} from "react";
import {Project} from "../data/classes/bussiness/Project";
import {ProjectDashboard} from "../components/dashboard/ProjectDashboard";
import {ProjectTasks} from "./ProjectTasks";
import {Trans} from "@lingui/macro";

class ProjectNotes extends React.Component<{ appData: AppData }> {
    render() {
        return null;
    }
}

export enum DashboardTab{
    DASHBOARD,TASKS,NOTES
}
export function MainScreen(props: { appData: AppData }) {
    const [selectedProject, setSelectedProject] = useState(props.appData?.currentProject ? props.appData.currentProject : null);

    const [projectTab, setProjectTab] = useState(DashboardTab.DASHBOARD);
    useEffect(() => {
        if(selectedProject){
            props.appData.changeCurrentProject(selectedProject)
        }
    }, [selectedProject]);


    useEffect(() => {
        props.appData.changeDashboard = (p: Project) => setSelectedProject(p)
    }, [props.appData]);
    useEffect(() => {
        props.appData.changeDashboardTab=(tab:DashboardTab)=>setProjectTab(tab)
    }, []);
    function renderTabContent() {
        switch (projectTab) {
            case  DashboardTab.TASKS:
                return <ProjectTasks appData={props.appData}/>
            case  DashboardTab.NOTES:
                return <ProjectNotes appData={props.appData}/>
            default:
                return <ProjectDashboard appData={props.appData}/>
        }
    }

        return props.appData && selectedProject ?

            <div className='w-[100%] h-full overflow-scroll no-scrollbar p-4 bg-base-300 right-shadow-in' >
                <div className="">
                    <div className="navbar-start"></div>
                    <div className="tabs navbar-center w-[100%]  mt-0 bg-base-300">
                        <div className={`tab tab-sm tab-lifted w-[30%] ${projectTab === DashboardTab.DASHBOARD ? 'tab-active right-shadow z-10 ' : 'bg-base-200 text-base-content/25'}`}
                           onClick={(e) => {
                               e.preventDefault();
                               setProjectTab( DashboardTab.DASHBOARD)
                           }}><Trans>Dashboard</Trans></div>
                        <div className={`tab tab-sm tab-lifted w-[30%] ${projectTab ===  DashboardTab.TASKS ? 'tab-active right-shadow z-10 ' : 'bg-base-200 text-base-content/25'}`}
                           onClick={(e) => {
                               e.preventDefault();
                               setProjectTab( DashboardTab.TASKS)
                           }}><Trans>Tasks</Trans></div>
                        <div className={`tab tab-sm tab-lifted w-[30%] ${projectTab ===  DashboardTab.NOTES ? 'right-shadow z-10 tab-active' : 'bg-base-200 text-base-content/25'}`}
                           onClick={(e) => {
                               e.preventDefault();
                               setProjectTab( DashboardTab.NOTES)
                           }}><Trans>Notes</Trans></div>
                    </div>
                    <div className="navbar-end"></div>
                </div>
                <div className="z-10 relative flex p-2 bg-base-100 w-[100%] min-h-[90%] rounded-tr-box  right-shadow  "
                     style={{borderWidth: "2px", borderTopWidth: "0px", borderColor: "var(--main-grey)"}}>
                    {renderTabContent()}
                </div>
            </div>
            :
            <div className="z-10 flex align-middle h-[100%] w-[100%] justify-center ">
                <div className="justify-center flex w-64 ">
                    <div className="align-middle loading loading-ball loading-md "/>
                    <div className="align-middle loading loading-ball loading-sm "/>
                    <div className="align-middle loading loading-ball loading-md "/>

                </div>
            </div>

}
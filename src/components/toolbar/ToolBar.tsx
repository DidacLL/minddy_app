import {MinddyManager} from "../../data/Minddy.manager";
import React, {useEffect, useState} from "react";
import {UserDropdown} from "./data/UserDropdown";
import {
    ArchiveBoxArrowDownIcon,
    ArchiveBoxIcon,
    Bars3Icon,
    HeartIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PlusIcon
} from "@heroicons/react/20/solid";
import {ToolBarDropdown} from "./ToolBarDropdown";
import {APP_LOGO, APP_NAME} from "../../App";
import {FavouritesMenu} from "./data/FavouritesMenu";
import {Link, useNavigate, useParams} from "react-router-dom";
import {PathBreadcrumbs} from "../dashboard/PathBreadcrumbs";
import {Project} from "../../data/classes/dao/Project";

interface ToolBarProps {
    isMini: boolean,
    manager: MinddyManager,
    disabled:boolean
}


export function ToolBar(props: ToolBarProps) {
    let params = useParams();

    const [minimizeMenu, setMinimizeMenu] = useState<any>();

    const [currentProject, setCurrentProject] = useState<Project>();
    const [minimized, setMinimized] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setMinimizeMenu(() => props.manager.toggleProjectTree)

    }, [props.manager,props.disabled]);

    useEffect(() => {

    }, [minimized]);

    useEffect(() => {
        if(params.projectId) {
            const project = props.manager.getProject(params.projectId);
            project && setCurrentProject(project)
        }
    }, [params]);
    useEffect(() => {
        if(params.projectId) {
            const project = props.manager.getProject(params.projectId);
            project && setCurrentProject(project)
        }
        props.manager.updateProjectButton = (b: boolean) => setMinimized(b)
    }, []);
    return <div className="z-40 navbar-lite navbar bg-primary p-0  m-0 flex flex-nowrap w-screen h-min  ">
        {/*_________________START----------------*/}
        <div className="navbar-start w-1/4 h-1">
            <div className='flex flex-nowrap'>
                {/*HIDDEN MENU-----------------------------------------------------------------------------------------------------------HIDDEN MENU */}
                <div className="dropdown">
                    <label tabIndex={0} className="md:hidden ">
                        <Bars3Icon className="btn btn-circle btn-xs hover:bg-neutral p-2 hover:ring-accent"/>
                    </label>
                    <ul tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 p-2 bg-primary rounded-box w-52">
                        <li><a>Item 1</a></li>
                        <li>
                            <a>Parent</a>
                            <ul className="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </li>
                        <li><a>Item 3</a></li>
                    </ul>
                </div>
                {/*APP NAME-----------------------------------------------------------------------------------------------------------------APP NAME */}
                <Link to={"/dashboard"}
                      className="btn btn-ghost h-full normal-case txt-xl font-mono font-black text-base-100 hover:text-primary-content hover:bg-secondary"
                      onClick={() => navigate('/dashboard')}
                >{props.manager.screen.windowSize.width>1000?APP_NAME:APP_LOGO}</Link>
            </div>
            {/*BUTTONS LEFT-----------------------------------------------------------------------------------------------------------BUTTONS LEFT*/}
            <div className=" grow  flex flex-nowrap gap-x-4">
                {/*TOGGLE PROJECT-----------------------------------------------------------------------------------------------------------TOGGLE PROJECT*/}
                <div className="flex grow content-center origin-center ">
                    <button
                        disabled={props.disabled}
                        onClick={(e) => {
                            e.preventDefault();
                            setMinimized(!minimized);
                            minimizeMenu();
                        }}
                        className={`h-full txt-s text-primary-content flex flex-nowrap  lowercase btn btn-xs tooltip tooltip-bottom ${minimized ? '' : 'force-shadow-in'}`}
                        defaultChecked={true}
                        // style={{borderRadius: "4rem"}}
                        data-tip="projects">
                        {minimized ? <ArchiveBoxIcon className="h-[2em] font-extrabold"/> :
                            <ArchiveBoxArrowDownIcon  className="h-[2em] font-extrabold "/>}
                        <label className="hidden 2xl:flex normal-case p-2">Projects</label>
                    </button>
                </div>


                {/*FAVOURITES*/}
                <label className="justify-around align-middle ">
                    <ToolBarDropdown manager={props.manager}
                                     menu={() => <FavouritesMenu manager={props.manager}/>}
                                     iconJSX={<HeartIcon className="h-full"/>} name={"Favourites"}/> </label>

                {/*{props.manager.screen.isHorizontal() && <HorizontalScrollMenu icons={Icons.getElements()}/>}*/}

            </div>
        </div>
        {/*//////////////////////// CENTER /////////////////////////////*/}
        <div className="px-2 navbar-center content-center  w-1/2 flex">
            <div className='bg-base-300 h-[2em] align-middle  rounded-box w-full justify-between center-shadow-in flex-nowrap md:flex txt-l hidden'>
                <div className='pl-2 w-full  flex flex-row flex-nowrap text-primary-content text-center font-mono font-bold txt-s  overflow-hidden text-ellipsis whitespace-nowrap'>
                    <div className='max-w-prose overflow-hidden text-ellipsis whitespace-nowrap'>
                        {currentProject && <PathBreadcrumbs
                            path={currentProject.getAllProjectsPath()
                                .map(s => props.manager.getProject(s)
                                    || currentProject)}
                            handleClick={(v) => {
                                navigate("/dashboard/"+v.id.toLowerCase())

                            }}/>}
                    </div>
                    <label className=' min-w-fit p-1 font-black text-md text-neutral cursor-pointer hover:text-main-light'
                    onClick={()=>{
                        navigate('/dashboard')
                    }}>
                        {' >_'}{currentProject?.name}

                    </label>
                </div>
                <div className="h-[2em] flex flex-nowrap flex-row items-center btn-group btn-group-horizontal ">

                    <div className="" onClick={()=>{
                        if (currentProject)navigate('/project/1/'+currentProject?.id)
                    }}>
                        <PlusIcon className=" btn btn-ghost btn-sm  font-extrabold "/>
                    </div>
                    <div className="mr-4" onClick={()=>{
                        if (currentProject)navigate('/project/0/'+currentProject?.id)
                    }}>
                        <PencilSquareIcon className=" btn btn-ghost  btn-sm py-1 font-extrabold "/>
                    </div>
                </div>
            </div>
        </div>
        <div className="navbar-end align-middle flex-row place-items-center justify-between flex grow">
            <div className="form-control h-auto grow align-middle place-items-center flex flex-row ">
                <input type="text" placeholder="Search"
                       className="input input-bordered w-2 input-sm flex-grow input-primary hidden md:flex  "/>
                <MagnifyingGlassIcon className="w-10 p-2 hover:text-secondary  -inset-x-10"/>
            </div>
            <div className="hover:text-secondary ">
                <UserDropdown manager={props.manager}/>
            </div>
        </div>

    </div>


}
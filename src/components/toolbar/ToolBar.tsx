import {MinddyManager} from "../../data/Minddy.manager";
import React, {useEffect, useState} from "react";
import {UserDropdown} from "./data/UserDropdown";
import {
    ArchiveBoxArrowDownIcon,
    ArchiveBoxIcon,
    Bars3Icon, HeartIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PlusIcon,
    StarIcon
} from "@heroicons/react/20/solid";
import {ToolBarDropdown} from "./ToolBarDropdown";
import {APP_LOGO, APP_NAME} from "../../App";
import {FavouritesMenu} from "./data/FavouritesMenu";
import {Link, useNavigate} from "react-router-dom";
import {PathBreadcrumbs} from "../dashboard/PathBreadcrumbs";
import {DashboardTab} from "../../pages/MainScreen";

interface ToolBarProps {
    isVertical: boolean,
    manager: MinddyManager
}


export function ToolBar(props: ToolBarProps) {

    const [minimizeMenu, setMinimizeMenu] = useState<any>();

    const [currentProject, setCurrentProject] = useState<string>('');
    const [minimized, setMinimized] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setMinimizeMenu(() => props.manager.minimizeProjectTree)

    }, [props.manager]);

    useEffect(() => {

    }, [minimized]);

    useEffect(() => {
        props.manager.updateToolbar = () => {
            setCurrentProject(props.manager.currentProject.name)
        }
        props.manager.updateProjectButton = (b: boolean) => setMinimized(b)
    }, []);
    return <div className="z-40 navbar bg-primary p-0  m-0 flex flex-nowrap w-screen h-16 ">
        {/*_________________START----------------*/}
        <div className="navbar-start w-1/4 ">
            <div className='flex flex-nowrap'>
                {/*HIDDEN MENU-----------------------------------------------------------------------------------------------------------HIDDEN MENU */}
                <div className="dropdown">
                    <label tabIndex={0} className="md:hidden ">
                        <Bars3Icon className="btn btn-circle hover:bg-neutral p-2 hover:ring-accent"/>
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
                      className="btn btn-ghost normal-case text-xl font-mono font-black text-base-100 hover:text-primary-content hover:bg-secondary"
                      onClick={() => props.manager.changeCurrentProject(props.manager.structure.root.project)}
                >{props.manager.screen.windowSize.width>1000?APP_NAME:APP_LOGO}</Link>
            </div>
            {/*BUTTONS LEFT-----------------------------------------------------------------------------------------------------------BUTTONS LEFT*/}
            <div className="text-primary shadow-r flex flex-nowrap gap-x-4">
                {/*TOGGLE PROJECT-----------------------------------------------------------------------------------------------------------TOGGLE PROJECT*/}
                <label className="justify-around ">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setMinimized(!minimized);
                            minimizeMenu();
                        }}
                        className={`p-2 text-primary-content flex flex-nowrap btn-shadow mr-2 lowercase tooltip tooltip-bottom ${minimized ? '' : 'force-shadow-in'}`}
                        defaultChecked={true}
                        style={{borderRadius: "4rem"}}
                        data-tip="projects">
                        {minimized ? <ArchiveBoxIcon height={"1.5em"} className=" font-extrabold "/> :
                            <ArchiveBoxArrowDownIcon height={"1.5em"} className=" font-extrabold "/>}
                        <label className="hidden 2xl:flex normal-case px-1">Projects</label>
                    </button>
                </label>


                {/*FAVOURITES*/}
                <label className="justify-around align-middle ">
                    <ToolBarDropdown manager={props.manager}
                                     menu={() => <FavouritesMenu manager={props.manager}/>}
                                     iconJSX={<HeartIcon height={"1.6em"} className=""/>} name={"Favourites"}/> </label>

                {/*{props.manager.screen.isHorizontal() && <HorizontalScrollMenu icons={Icons.getElements()}/>}*/}

            </div>
        </div>
        {/*//////////////////////// CENTER /////////////////////////////*/}
        <div className="p-2 navbar-center h-full content-center align-middle w-1/2 flex">
            <div className='bg-base-300 h-full align-middle  rounded-box w-full justify-between center-shadow-in flex-nowrap md:flex hidden'>
                <div className='pl-2 w-full h-full pt-2 flex flex-row flex-nowrap text-primary-content text-center font-mono font-bold text-xl  overflow-hidden text-ellipsis whitespace-nowrap'>
                    <div className='max-w-prose overflow-hidden text-ellipsis whitespace-nowrap'>
                        <PathBreadcrumbs
                            path={props.manager.currentProject.getAllProjectsPath()
                                .map(s => props.manager.structure.getNodeById(s)?.project
                                    || props.manager.currentProject)}
                            handleClick={(v) => {
                                props.manager.changeCurrentProject(v)

                            }}/>
                    </div>
                    <label className=' min-w-fit p-1 font-black text-md text-neutral cursor-pointer hover:text-main-light'
                    onClick={()=>{
                        props.manager.changeDashboardTab(DashboardTab.DASHBOARD)
                        navigate('/dashboard')
                    }}>
                        {' >_'}{currentProject}

                    </label>
                </div>
                <div className="h-full flex flex-nowrap flex-row items-center btn-group btn-group-horizontal ">

                    <div className="">
                        <PlusIcon className=" btn btn-ghost py-2 font-extrabold "/>
                    </div>
                    <div className="">
                        <PencilSquareIcon className=" btn btn-ghost  py-3 font-extrabold "/>
                    </div>
                </div>
            </div>
        </div>
        <div className="navbar-end justify-end flex grow">
            <div className="form-control grow flex flex-row">
                <input type="text" placeholder="Search"
                       className="input input-bordered  w-2 input-md flex-grow input-primary hidden md:flex  "/>
                <MagnifyingGlassIcon className="w-10 p-2 hover:text-secondary  -inset-x-10"/>
            </div>
            <div className="hover:text-secondary ">
                <UserDropdown manager={props.manager}/>
            </div>
        </div>

    </div>


}
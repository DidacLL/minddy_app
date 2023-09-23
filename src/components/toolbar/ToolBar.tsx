import {AppData} from "../../data/classes/AppData";
import React, {useEffect, useState} from "react";
import {UserDropdown} from "./data/UserDropdown";
import {
    ArchiveBoxArrowDownIcon,
    ArchiveBoxIcon,
    Bars3Icon,
    CalendarIcon,
    MagnifyingGlassIcon,
    PlusIcon
} from "@heroicons/react/20/solid";
import {ToolBarDropdown} from "./ToolBarDropdown";
import {NewMenu} from "./data/NewMenu";
import {APP_NAME} from "../../App";
import {FavouritesMenu} from "./data/FavouritesMenu";
import {HorizontalScrollMenu} from "./HorizontalScrollMenu";
import {Icons} from "../../utils/Icons";
import {Link} from "react-router-dom";

interface ToolBarProps {
    isVertical: boolean,
    appData: AppData
}


export function ToolBar(props: ToolBarProps) {

    const [minimizeMenu, setMinimizeMenu] = useState<any>();

    const [currentProject, setCurrentProject] = useState<string>('');
    const [minimized, setMinimized] = useState(false);
    useEffect(() => {
        setMinimizeMenu(() => props.appData.minimizeProjectTree)
    }, [props.appData.minimizeProjectTree]);

    useEffect(() => {

    }, [minimized]);

    useEffect(() => {
        props.appData.updateToolbar= ()=>{
            setCurrentProject(props.appData.currentProject.name)
        }
        props.appData.updateProjectButton=(b:boolean)=>setMinimized(b)
    }, []);
    return props.isVertical ?
        props.appData.screen.getDesignNumber() < 2 ?
            //LOW RESOLUTION VERTICAL BAR
            <div>
                <div className='join'>
                    <div className="navbar join-item">
                        <a className="btn btn-circle">+</a>
                    </div>
                    {/*TODO*/}
                </div>
                <div id={'favourites box'}>
                    {/*TODO*/}
                </div>
            </div>
            :
            //HIGH RESOLUTION VERTICAL BAR
            <div>
                <div className='join'>
                    <div className="navbar join-item">
                        <a className="btn btn-circle">+</a>
                    </div>
                    {/*TODO*/}
                </div>
                <div id={'favourites box'}>
                    {/*TODO*/}
                </div>
            </div>
        : props.appData.screen.getDesignNumber() < 2 ?
            //LOW RESOLUTION HORIZONTAL BAR
            <div>
                <div className='join '>
                    <div className="navbar join-item">
                        <a className="btn btn-circle">+</a>
                    </div>
                    {/*TODO*/}
                </div>
                <div id={'favourites box'}>
                    {/*TODO*/}
                </div>
            </div>
            :
            //HIGH RESOLUTION HORIZONTAL BAR
            <div className="navbar bg-primary p-0  m-0 z-20 relative h-[1rem] flex flex-nowrap max-w-screen ">
                <div className="navbar-start justify-between ">
                    <div>
                        {/*HIDDEN MENU */}
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
                        <Link to={"/dashboard"}
                            className="btn btn-ghost normal-case text-xl font-mono font-black text-base-100 hover:text-primary-content hover:bg-secondary"
                            // onClick={(): void | null => minimizeMenu ? minimizeMenu() : null}
                        >{APP_NAME}</Link>
                    </div>
                    <div className="text-primary shadow-r flex flex-nowrap gap-x-4">
                        <label className="justify-around ">
                            <button
                                onClick={(e) =>{
                                    e.preventDefault();
                                    setMinimized(!minimized);
                                    minimizeMenu();
                                }}
                                className={`p-2 text-primary-content flex flex-nowrap btn-shadow mr-2 lowercase tooltip tooltip-bottom ${minimized?'':'force-shadow-in'}`}
                                defaultChecked={true}
                                style={{borderRadius:"4rem"}}
                                data-tip="projects">
                                {minimized?<ArchiveBoxIcon height={"1.5em"}  className=" font-extrabold "/>:
                                <ArchiveBoxArrowDownIcon height={"1.5em"}  className=" font-extrabold "/>}
                                <label className="hidden 2xl:flex normal-case px-1">Projects</label>
                            </button>
                        </label>
                        <label className="justify-around ">
                            <ToolBarDropdown appData={props.appData} menu={NewMenu}
                                             iconJSX={<PlusIcon height={"1.6em"}  className=" font-extrabold " />}
                                             name={"New..."}/></label>
                        {/*FAVOURITES*/}
                        <label className="justify-around align-middle ">
                            <ToolBarDropdown appData={props.appData}
                                             menu={() => <FavouritesMenu appData={props.appData}/>}
                                             iconJSX={<CalendarIcon height={"1.6em"}  className=""/>} name={"Favourites"}/> </label>

                    </div>
                </div>
                {/*//////////////////////// CENTER /////////////////////////////*/}
                <div className="max-w-[50%] p-2 navbar-center hidden md:flex ">
                    <HorizontalScrollMenu icons={Icons.getElements()}/>

                </div>
                <div className="navbar-end justify-between flex overflow-hidden">
                    <div className='pl-2 w-0 xl:w-full text-primary-content text-center font-mono font-bold text-xl overflow-hidden text-ellipsis whitespace-nowrap'>
                        {'_'}{currentProject}
                    </div>
                    <div className="menu menu-horizontal justify-around text-primary-content flex flex-nowrap">
                    </div>
                </div>


                            <div className="form-control flex flex-row">
                                <input type="text" placeholder="Search" className="input input-bordered hidden md:flex w-36 lg:w-min focus:w-auto" />
                                <MagnifyingGlassIcon className="w-10 p-2 hover:text-secondary relative -inset-x-10"/>
                            </div>
                        <div className="hover:text-secondary ">
                            <UserDropdown appData={props.appData}/>
                        </div>
            </div>


}
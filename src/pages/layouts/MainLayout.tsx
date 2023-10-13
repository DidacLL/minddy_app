import {Outlet, useNavigate} from "react-router-dom";
import {ProjectTree} from "../../components/tree/ProjectTree";
import {ToolBar} from "../../components/toolbar/ToolBar";
import {MinddyManager} from "../../data/Minddy.manager";
import React, {useEffect, useRef, useState} from "react";
import {ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {EllipsisHorizontalIcon, EllipsisVerticalIcon} from "@heroicons/react/20/solid";


export function MainLayout({manager}: { manager: MinddyManager }) {
    const MIN_PANEL_SIZE = () => (vertical ? 20 : 15) + (Math.max(window.innerWidth,window.innerHeight)>1000? -10 : 5);
    const [resize, setResize] = useState(false);
    const navigate = useNavigate();
    const projectPanel = useRef<ImperativePanelHandle | null>(null);
    const sizeHandler = useRef<HTMLDivElement | null>(null);
    const [vertical, setVertical] = useState<boolean>(window.innerWidth < window.innerHeight);
    const [bigScreen, setBigScreen] = useState<boolean>();
    useEffect(() => {
    }, [bigScreen]);
    useEffect(() => {
    }, [vertical]);
    useEffect(() => {
        setBigScreen(Math.max(window.innerWidth,window.innerHeight)>1000)
        if (sizeHandler.current) {
            if (vertical) sizeHandler.current.style.height = `${resize ? 10 : 6}px`;
            else sizeHandler.current.style.width = `${resize ? 18 : 12}px`;
        }
        if (manager) {
            setBigScreen(Math.max(window.innerWidth,window.innerHeight)>1000)
            manager.minimizeProjectTree = (): void => {
                if (projectPanel.current) {
                    if (projectPanel.current.getCollapsed()) {
                        projectPanel.current.expand();
                        setResize(false);
                    } else {
                        projectPanel.current.collapse()
                        setResize(true);
                    }
                    manager.updateToolbar();
                }
            }
        }

    }, [resize]);

    useEffect(() => {
        navigate('/dashboard')
        const handleResize =()=> {
            setVertical(window.innerWidth < window.innerHeight);
            setBigScreen(window.innerWidth>1000);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function MouseResizeHandler() {
        if (projectPanel.current) {
            if (projectPanel.current.getCollapsed()) {
                projectPanel.current.resize(MIN_PANEL_SIZE() + 1)
                setResize(false)
                manager?.updateProjectButton(false);
            }
            if (projectPanel.current.getSize() < MIN_PANEL_SIZE()) {
                if (projectPanel.current.getSize() - MIN_PANEL_SIZE() < Math.floor(-1 * (MIN_PANEL_SIZE() / 2))) {
                    projectPanel.current.collapse()
                    setResize(true)
                    manager?.updateProjectButton(true);
                } else {
                    projectPanel.current.resize(MIN_PANEL_SIZE() + 1)
                    setResize(false)
                    manager?.updateProjectButton(false);
                }
            }
        }
    }

    function getOnResize(current: number, previous: number) {
        if (projectPanel.current && current < MIN_PANEL_SIZE()) {
            if (previous > current) {
                const mouseUpEvent = new MouseEvent('mouseup', {
                    bubbles: true, cancelable: true, view: window
                });
                document.dispatchEvent(mouseUpEvent);
                setTimeout((e) => {
                        // @ts-ignore
                        projectPanel.current.collapse();
                        setResize(true)
                        manager?.updateProjectButton(true)
                    },
                    0);

            }
        }

    }

    if (manager) {
        // -----------------------------------------------------------------------------------------------------VERTICAL
        if (vertical) {
            return <div style={{display: "flex", flexDirection: "column"}} className='h-screen '>
                <PanelGroup direction="vertical"
                            className="flex-grow  flex w-screen justify-items-center overflow-hidden bg-primary pb-2 z-0">
                    <Panel defaultSize={50} minSize={50} order={0}
                           className='w-full h-full flex  flex-grow -z-10 bg-primary overflow-y-scroll'>
                        <Outlet/>
                    </Panel>
                    <div className="flex justify-center align-baseline  h-4 "
                         onMouseEnter={() => !projectPanel.current?.getCollapsed() && setResize(true)}
                         onMouseLeave={() => !projectPanel.current?.getCollapsed() && setResize(false)}
                         onMouseUp={MouseResizeHandler}>

                        <PanelResizeHandle className="w-full  flex justify-center">
                            <div className=" h-4 rounded-t-box " ref={sizeHandler}>
                                {resize && <EllipsisHorizontalIcon className=" h-6 text-base-300 "/>}
                            </div>
                        </PanelResizeHandle>
                    </div>
                    <ToolBar isMini={true} manager={manager}></ToolBar>
                    <Panel defaultSize={50} minSize={0}
                           className=''
                           ref={projectPanel}
                           collapsible={true} collapsedSize={0} order={1}
                           onResize={(c, p) => getOnResize(c, p)}>
                        <ProjectTree manager={manager}/>
                    </Panel>

                </PanelGroup>
            </div>
        }
        // ---------------------------------------------------------------------------------------------------HORIZONTAL
        return (<div className=" h-screen flex flex-col max-w-screen overflow-hidden">

            {bigScreen && <ToolBar isMini={false} manager={manager}/>}
            <PanelGroup direction="horizontal"
                        className="flex flex-grow  bg-primary z-0">
                <Panel defaultSize={30} minSize={0}
                       className=""
                       ref={projectPanel}
                       collapsible={true} collapsedSize={0} order={1}
                       onResize={(c, p) => getOnResize(c, p)}>
                    {!bigScreen && <ToolBar isMini={true} manager={manager}/>}
                    <ProjectTree manager={manager}/>
                </Panel>

                <div className="flex items-center w-4  "
                     onMouseEnter={() => !projectPanel.current?.getCollapsed() && setResize(true)}
                     onMouseLeave={() => !projectPanel.current?.getCollapsed() && setResize(false)}
                     onMouseUp={MouseResizeHandler}>

                    <PanelResizeHandle className="flex align-middle grow  h-36 w-12 z-10 p-2">
                        <div
                            className="min-h-full flex flex-col place-items-center bg-primary align-middle rounded-r-box"
                            ref={sizeHandler}>
                            {resize && <EllipsisVerticalIcon className="h-full py-12 pr-2 text-base-300  "/>}
                        </div>
                    </PanelResizeHandle>
                </div>
                <Panel defaultSize={70} minSize={50} order={20}
                       className='flex flex-col  grow -z-10 align-middle'>
                    <div
                        className='grow  flex flex-col place-content-around justify-around overflow-y-scroll no-scrollbar'>

                        <Outlet/>
                        <div className='xl:flex  hidden w-full justify-end px-10'>
                            made by
                            <a href={"https://github.com/DidacLL"} target="_blank" className='px-2'> Dídac Llorens</a>
                        </div>
                    </div>
                </Panel>

            </PanelGroup>
        </div>)


    }


    return <div className='flex align-middle items-center justify-center'>
        <div className='relative flex'>

            <div className=' scale-150 loading-ball -mr-0.5 loading-lg text-primary'>
                <div className='bg-base-100 loading-dots'>X</div>
            </div>
            <div className=' scale-150 loading-ball -ml-0.5 loading-lg text-primary'>
                <div className='bg-base-100 loading-dots'>X</div>
            </div>
        </div>
        <div className='absolute flex'>

            <div className=' scale-150 loading-ball -mr-0.5 loading-lg text-primary'>
                <div className='bg-secondary/20 loading-dots'>X</div>
            </div>
            <div className=' scale-150 loading-ball -ml-0.5 loading-lg text-primary'>
                <div className='bg-secondary/20 loading-dots'>X</div>
            </div>
        </div>
        <div className='absolute flex'>

            <div className=' scale-150 loading-ball -mr-0.5 loading-lg text-primary'>
                <div className='bg-secondary/20 loading-dots'>X</div>
            </div>
            <div className=' scale-150 loading-ball -ml-0.5 loading-lg text-primary'>
                <div className='bg-secondary/20 loading-dots'>X</div>
            </div>
        </div>
        <div className='absolute flex'>

            <div className=' scale-150 loading-ball -mr-0.5 loading-lg text-primary'>
                <div className='bg-secondary/20 loading-dots'>X</div>
            </div>
            <div className=' scale-150 loading-ball -ml-0.5 loading-lg text-primary'>
                <div className='bg-secondary/20 loading-dots'>X</div>
            </div>
        </div>
    </div>;

}
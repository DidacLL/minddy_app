import {Outlet, useNavigate} from "react-router-dom";
import {ProjectTree} from "../../components/tree/ProjectTree";
import {ToolBar} from "../../components/toolbar/ToolBar";
import {AppData} from "../../data/classes/AppData";
import React, {useEffect, useRef, useState} from "react";
import {
    ImperativePanelHandle,
    Panel,
    PanelGroup,
    PanelResizeHandle,
    PanelResizeHandleProps
} from "react-resizable-panels";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";


export function MainLayout({appData}: { appData: AppData | undefined }) {
    const MIN_PANEL_SIZE = 15;
    const [resize, setResize] = useState(false);
    const navigate = useNavigate();
    const projectPanel = useRef<ImperativePanelHandle | null>(null);
    const sizeHandler = useRef<HTMLDivElement | null>(null);
    const handler = useRef<PanelResizeHandleProps | null>(null);

    useEffect(() => {
        if (sizeHandler.current) {
            sizeHandler.current.style.width = `${resize ? 18 : 8}px`;

        }
        if (appData) {
            appData.minimizeProjectTree = (): void => {
                if (projectPanel.current) {
                    if (projectPanel.current.getCollapsed()) {
                        projectPanel.current.expand();
                        setResize(false);
                    } else {
                        projectPanel.current.collapse()
                        setResize(true);
                    }
                    appData.updateToolbar();
                }
            }
        }

    }, [resize]);

    useEffect(() => {
        navigate('/dashboard')

    }, []);

    function MouseResizeHandler() {
        if (projectPanel.current) {
            if (projectPanel.current.getCollapsed()) {
                projectPanel.current.resize(MIN_PANEL_SIZE + 1)
                setResize(false)
                appData?.updateProjectButton(false);
            }
            if (projectPanel.current.getSize() < MIN_PANEL_SIZE) {
                if (projectPanel.current.getSize() - MIN_PANEL_SIZE < Math.floor(-1 * (MIN_PANEL_SIZE / 2))) {
                    projectPanel.current.collapse()
                    setResize(true)
                    appData?.updateProjectButton(true);
                } else {
                    projectPanel.current.resize(MIN_PANEL_SIZE + 1)
                    setResize(false)
                    appData?.updateProjectButton(false);
                }
            }
        }
    }

    function getOnResize(current: number,previous:number) {
            if (projectPanel.current && current < MIN_PANEL_SIZE) {
                if (previous > current) {
                    const mouseUpEvent = new MouseEvent('mouseup', {
                        bubbles: true, cancelable: true, view: window
                    });
                    document.dispatchEvent(mouseUpEvent);
                    setTimeout((e) => {
                            // @ts-ignore
                            projectPanel.current.collapse();
                            setResize(true)
                            appData?.updateProjectButton(true)
                        },
                        0);

                }
            }

    }

    if (appData) {
        if (appData.screen.getDesignNumber() < 2) {
            if (appData.screen.isVertical()) {
                // MINI VERTICAL
                return <div style={{display: "flex", flexDirection: "row"}}>
                    <Outlet/>
                    <ToolBar isVertical={false} appData={appData}/>
                </div>;
            }
            // MINI HORIZONTAL
            return <div style={{display: "flex", flexDirection: "column"}}>
                <ToolBar isVertical={true} appData={appData}/> <Outlet/>
            </div>
        }

        if (appData.screen.isVertical()) {
            //MEDIUM VERTICAL
            return <div style={{display: "flex", flexDirection: "row"}}>
                <div>
                    <Outlet/>
                </div>
                <ToolBar isVertical={false} appData={appData}></ToolBar>
            </div>
        }

        // HORIZONTAL
        return (<div className=" h-screen flex flex-col max-w-screen overflow-hidden bg-primary">
            <ToolBar isVertical={false} appData={appData}/>
            <PanelGroup direction="horizontal" className=" relative flex mb-2 flex-grow justify-items-center">
                <Panel defaultSize={30} minSize={0} className="z-0"
                       ref={projectPanel}
                       collapsible={true} collapsedSize={0} order={1}
                       onResize={(c,p)=>getOnResize(c,p)}>
                    <ProjectTree appData={appData}/>
                </Panel>

                <div className=" flex items-center w-4 bg-primary rounded-l-box "
                     onMouseEnter={() => !projectPanel.current?.getCollapsed() && setResize(true)}
                     onMouseLeave={() => !projectPanel.current?.getCollapsed() && setResize(false)}
                     onMouseUp={MouseResizeHandler}>

                    <PanelResizeHandle className="flex items-center w-[2px] ">
                        <div className="flex items-center h-24 bg-primary w-20 rounded-r-box m-1 relative z-20 " ref={sizeHandler}>
                            {resize && <EllipsisVerticalIcon className=" w-36 text-base-300 -p-2 "/>}
                        </div>
                    </PanelResizeHandle>
                </div>
                <Panel defaultSize={70} minSize={50} order={20}>
                    <Outlet/>
                </Panel>
            </PanelGroup>
        </div>)



    }
    return <>ERR</>
}
import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./pages/public/Login";
import {About} from "./pages/public/About";
import {Register} from "./pages/public/Register";
import {PublicLayout} from "./pages/layouts/PublicLayout";
import {useScreenInfo} from "./data/hooks/useScreenSize";
import {MainLayout} from "./pages/layouts/MainLayout";
import {MinddyManager} from "./data/Minddy.manager";
import {MinddyUser} from "./data/classes/dao/MinddyUser";
import EditProject from "./pages/EditProject";
import EditTask from "./pages/EditTask";
import EditNote from "./pages/EditNote";
import {MainScreen} from "./pages/MainScreen";
import ErrorManager from "./data/error.manager";
import {ErrorPage} from "./pages/ErrorPage";
import {Kanban} from "./pages/Kanban";
import {Search} from "./pages/Search";
import {LandingPage} from "./pages/LandingPage";
import {DashboardTabs} from "./data/enums/DashboardTabs";


export const APP_NAME = <label className='font-black font-mono text-base-content'>_minddy</label>
export const APP_LOGO = <label className='font-black  text-base-content h-full'>_m</label>


function App() {

    const [touchScreen, setTouchScreen] = useState<boolean>(false);
    const screenInfo = useScreenInfo();
    const [user, setUser] = useState<MinddyUser>();
    const [appManager, setAppManager] = useState<MinddyManager>();
    const [loadedTree, setLoadedTree] = useState(false);
    const [serverError, setServerError] = useState<string>();



    useEffect(() => {
        const mouseHandler = () => setTouchScreen(false);
        const touchHandler = () => setTouchScreen(true);

        window.addEventListener('pointerdown', mouseHandler);
        window.addEventListener('touchstart', touchHandler);

        return () => {
            window.removeEventListener('pointerdown', mouseHandler);
            window.removeEventListener('touchstart', touchHandler);
        };
    }, []);

    useEffect(() => {
        if (user && (!appManager || user.token !== appManager.user.token)) {
            setAppManager(
                new MinddyManager(user, screenInfo, () => {
                    setLoadedTree(true)
                }, () => {
                    setServerError("USER ERROR")
                }, () => setUser(undefined),touchScreen));
        }
    }, [user]);
    //
    useEffect(() => {
        if (appManager) {
            appManager.screen = screenInfo;
            appManager.isTouchScreen=touchScreen;
        }
    }, [screenInfo,touchScreen])
    useEffect(() => {

    }, [serverError]);
    const loginUser = (token: string) => {
        try {
            new MinddyUser(token, setUser, () => setServerError("User not found!"));

        } catch (e) {
            console.log("User not found!")

        }
        //TODO if user constructor throws fetch error redirect to login again
    }


    if (user && appManager) {
        if (!loadedTree) return <div className='w-screen h-screen flex justify-center place-items-center'>

            <div className='loading-lg loading-bars loading'>
            </div>
        </div>
        return <ErrorManager onError={<div><h1>FATAL ERROR</h1></div>}>
            <BrowserRouter>
                <Routes>
                    {serverError ?
                        <Route path={"/"} element={<MainLayout manager={appManager}/>}>
                            <Route path={"*"} element={<div>{serverError}</div>}/>
                        </Route>
                        :
                        <Route path={"/"} element={<MainLayout manager={appManager}/>}>
                            <Route index path={"dashboard"} element={<MainScreen manager={appManager}/>}/>
                            <Route path={"dashboard/:proj"} element={<MainScreen manager={appManager}/>}>
                                <Route path={"tasks"} element={<MainScreen manager={appManager} tab={DashboardTabs.TASKS}/>}/>
                                <Route path={"notes"} element={<MainScreen manager={appManager} tab={DashboardTabs.NOTES}/>}/>
                            </Route>
                            <Route path={"kanban"} element={<Kanban appData={appManager}/>}/>
                            <Route path={"kanban/:id"} element={<Kanban appData={appManager}/>}/>
                            <Route path={"search"} element={<Search appData={appManager}/>}/>
                            <Route path={"edit/"}>
                                <Route path={"project/:id"} element={<EditProject appData={appManager} isNew={false}/>}/>
                                <Route path={"task/:id"} element={<EditTask appData={appManager} isNew={false}/>}/>
                                <Route path={"note/:id"} element={<EditNote manager={appManager} isNew={false}/>}/>
                            </Route>
                            <Route path={"new/"}>
                                <Route path={"project"} element={<EditProject appData={appManager} isNew={true}/>}/>
                                <Route path={"task"} element={<EditTask appData={appManager} isNew={true}/>}/>
                                <Route path={"note"} element={<EditNote manager={appManager} isNew={true}/>}/>
                            </Route>
                        </Route>
                    }
                </Routes>
            </BrowserRouter>
        </ErrorManager>
    }
    return (

        <ErrorManager onError={<div><h1>FATAL ERROR</h1></div>}>
            <BrowserRouter>
                <Routes>
                    {serverError ?
                        <Route path={""} element={<PublicLayout onServerError={setServerError}
                                                                screenData={screenInfo}
                                                                demo={() => loginUser("DEMO")}/>}>
                            <Route path="/about" element={<About/>}/>
                            <Route path={"*"} element={<ErrorPage error={serverError}/>}/>

                        </Route>:
                            <Route path={""} element={<PublicLayout onServerError={setServerError}
                                                                    screenData={screenInfo}
                                                                    demo={() => loginUser("DEMO")}/>}>
                                <Route index element={<LandingPage/>}/>
                                <Route path="/login" element={<Login onSubmit={loginUser}/>}/>
                                <Route path="/register" element={<Register onSubmit={loginUser}/>}/>
                                <Route path="/about" element={<About/>}/>
                                <Route path={"*"} element={<LandingPage/>}/>
                            </Route>
                            }
                        </Routes>


                        </BrowserRouter>
                        </ErrorManager>);
                    }


                    export default App;

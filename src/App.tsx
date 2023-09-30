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


export const APP_NAME = <label className='font-black font-mono text-base-content'>_minddy</label>
export const APP_LOGO = <label className='font-black  text-base-content h-full'>_m</label>


function Kanban(props: { appData: MinddyManager | undefined }) {
    return null;
}

function Search(props: { appData: MinddyManager | undefined }) {
    return null;
}

function LandingPage() {

    return <div className="hero">
        <div className="hero-content"><label className="font-extrabold text-xl">WELCOME!</label></div>
    </div>;
}

function App() {
    const screenInfo = useScreenInfo();
    const [user, setUser] = useState<MinddyUser>();
    const [appManager, setAppManager] = useState<MinddyManager>();
    const [loadedTree, setLoadedTree] = useState(false);
    const [serverError, setServerError] = useState<string>();

    useEffect(() => {
        if (user && (!appManager || user.token !== appManager.user.token)) {
            setAppManager(
                new MinddyManager(user, screenInfo, () => {
                    setLoadedTree(true)
                }, () => {
                    setServerError("SERVICE NOT RESPONDING")
                }, () => setUser(undefined)));
        }
    }, [user]);

    useEffect(() => {
        if (appManager) {
            appManager.screen = screenInfo;
        }
    }, [loadedTree, screenInfo])

    const loginUser = (token: string) => {
        try {
            console.log("loading user:" + token)
            new MinddyUser(token, setUser, () => setServerError("User not found!"));
            console.log("loading user:" + token)

        } catch (e) {
            console.log("User not found!")

        }
        //TODO if user constructor throws fetch error redirect to login again
    }
    if (serverError) return <div className='w-screen h-screen flex p-12 justify-center place-items-center'>
        {serverError}
    </div>

    if (user && appManager) {
        if (!loadedTree) return <div className='w-screen h-screen flex justify-center place-items-center'>

            <div className='loading-lg loading-bars loading'>
            </div>
        </div>
        return <ErrorManager onError={<div><h1>FATAL ERROR</h1></div>}>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<MainLayout manager={appManager}/>}>
                        <Route path={"dashboard"} element={<MainScreen manager={appManager}/>}/>
                        <Route path={"kanban"} element={<Kanban appData={appManager}/>}/>
                        <Route path={"search"} element={<Search appData={appManager}/>}/>
                        <Route path={"edit/"}>
                            <Route path={"project"} element={<EditProject appData={appManager} isNew={false}/>}/>
                            <Route path={"task"} element={<EditTask appData={appManager} isNew={false}/>}/>
                            <Route path={"note"} element={<EditNote manager={appManager} isNew={false}/>}/>
                        </Route>
                        <Route path={"new/"}>
                            <Route path={"project"} element={<EditProject appData={appManager} isNew={true}/>}/>
                            <Route path={"task"} element={<EditTask appData={appManager} isNew={true}/>}/>
                            <Route path={"note"} element={<EditNote manager={appManager} isNew={true}/>}/>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ErrorManager>
    }
    return (

        <ErrorManager onError={<div><h1>FATAL ERROR</h1></div>}>
            <BrowserRouter>
                <Routes>
                    <Route path={""} element={<PublicLayout onServerError={setServerError}
                                                            screenData={screenInfo}
                                                            demo={() => loginUser("DEMO")}/>}>
                        <Route index element={<LandingPage/>}/>
                        <Route path="/login" element={<Login onSubmit={loginUser}/>}/>
                        <Route path="/register" element={<Register onSubmit={loginUser}/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path={"*"} element={<LandingPage/>}/>
                    </Route>
                </Routes>


            </BrowserRouter>
        </ErrorManager>);
}


export default App;

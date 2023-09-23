import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./pages/public/Login";
import {About} from "./pages/public/About";
import {Register} from "./pages/public/Register";
import {PublicLayout} from "./pages/layouts/PublicLayout";
import {useScreenInfo} from "./data/hooks/useScreenSize";
import {MainLayout} from "./pages/layouts/MainLayout";
import {AppData} from "./data/classes/AppData";
import {MinddyUser} from "./data/classes/bussiness/MinddyUser";
import EditProject from "./pages/EditProject";
import EditTask from "./pages/EditTask";
import EditNote from "./pages/EditNote";
import {MainScreen} from "./pages/MainScreen";


export const APP_NAME ="_minddy"


function Kanban(props: { appData: AppData | undefined }) {
    return null;
}

function Search(props: { appData: AppData | undefined }) {
    return null;
}

function LandingPage() {

    return <div className="hero">
        <div className="hero-content"> <label className="font-extrabold text-xl">WELCOME!</label></div></div>;}

function App() {
    const screenInfo = useScreenInfo();
    const [user, setUser] = useState<MinddyUser>();
    const [appData, setAppData] = useState<AppData>();
    const [loadedTree, setLoadedTree] = useState(false);
    // const [theme, setTheme] = useState(savedTheme);

   // useEffect(() => {
   //      document.querySelector('html')?.setAttribute('data-theme', theme);
   //  }, [theme]);
    useEffect(() => {
        if(user &&(!appData||user.token!==appData.user.token)){
            setAppData(new AppData(user,screenInfo,()=>setLoadedTree(true),()=>setUser(undefined)));
        }
    }, [user]);

    useEffect(() => {
        if(appData)appData.screen=screenInfo;
    }, [loadedTree, screenInfo])
    const loginUser = (token: string) => {
        setUser(new MinddyUser(token));
    }


    if(user && appData)
    return <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<MainLayout appData={appData}/>}>
                <Route path={"dashboard"} element={<MainScreen appData={appData}/>}/>
                <Route path={"kanban"} element={<Kanban appData={appData}/>}/>
                <Route path={"search"} element={<Search appData={appData}/>}/>
                <Route path={"edit/"} >
                    <Route path={"project"} element={<EditProject appData={appData} isNew={false}/>}/>
                    <Route path={"task"} element={<EditTask appData={appData}  isNew={false}/>}/>
                    <Route path={"note"} element={<EditNote appData={appData} isNew={false}/>}/>
                </Route>
                <Route path={"new/"}>
                    <Route path={"project"} element={<EditProject appData={appData} isNew={true}/>}/>
                    <Route path={"task"} element={<EditTask appData={appData}  isNew={true}/>}/>
                    <Route path={"note"} element={<EditNote appData={appData} isNew={true}/>}/>
                </Route>

            </Route>
        </Routes>
    </BrowserRouter>
    return (
        <BrowserRouter>
            <Routes>
                <Route path={""} element={<PublicLayout screenData={screenInfo} demo={()=>loginUser("DEMO")} />}>
                    <Route index element={<LandingPage/>}/>
                    <Route path="/login" element={<Login onSubmit={loginUser}/>}/>
                    <Route path="/register" element={<Register onSubmit={loginUser}/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path={"*"}  element={<LandingPage/>}/>
                </Route>
            </Routes>


        </BrowserRouter>
    );
}


export default App;

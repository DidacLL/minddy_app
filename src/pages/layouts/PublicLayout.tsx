import ScreenData from "../../data/classes/ScreenData";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {Trans} from "@lingui/macro";
import {LanguageSelector} from "../../components/toolbar/LanguageSelector";
import {APP_NAME} from "../../App";

interface PublicLayoutParams {
    screenData: ScreenData,
    demo: () => void
}

export function PublicLayout(props: PublicLayoutParams) {
    const navigate= useNavigate();
    const navDemo=()=>{
        props.demo();
        navigate('/dashboard');
    }
    return <div>
        <div className="navbar">
            <div className="navbar-start">
                <label className="text-xl font-extrabold">{APP_NAME}</label>
            </div>
            <div className="navbar-center">
                <Link className="" to={"/login"}>
                    <label className="btn p-2 ml-2"><Trans> Login</Trans></label>
                </Link>
                <Link to={"/register"}>
                    <label className="btn p-2 ml-2"> <Trans> Register</Trans> </label>
                </Link>
                <Link to={"/"}>
                    <label className="btn p-2 ml-2" onClick={navDemo}><Trans> Demo</Trans> </label>
                </Link>
                <Link to={"/about"}>
                    <label className="btn p-2 ml-2"> <Trans> About</Trans> </label>
                </Link>
            </div>
            <div className="navbar-end text-xs max-w-1/4 ">
                <label className="px-2">
                    <Trans>Language: </Trans>
                </label>
                <LanguageSelector/>
            </div>
        </div>
        <Outlet/>
    </div>
}

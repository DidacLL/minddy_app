import ScreenData from '../../data/classes/utils/ScreenData';
import {Link, Outlet, useNavigate, useParams} from 'react-router-dom';
import {Trans} from '@lingui/macro';
import {LanguageSelector} from '../../components/toolbar/LanguageSelector';
import {APP_NAME} from '../../App';
import {useContext, useEffect, useState} from 'react';
import MinddyService from "../../data/minddy.service";
import Cookies from "js-cookie";

interface PublicLayoutParams {
    screenData: ScreenData,
    onServerError: (message: string) => void,
    demo: () => void
}

export function PublicLayout(props: PublicLayoutParams) {
    let {pid: projectId} = useParams();//fixme
    const [serviceAvailable, setServiceAvailable] = useState<boolean>(false);
    const navigate = useNavigate();
    const navigateToDemoDashboard = () => {
        props.demo();
        navigate('/dashboard');
    }
    useEffect(() => {
    }, [serviceAvailable]);
    useEffect(() => {
        if(!serviceAvailable)MinddyService.ping().then(setServiceAvailable).catch((e)=>{
            setServiceAvailable(false);
            props.onServerError(e.message)
        })
    }, []);

    return <div>

        <div className='navbar'>
            <div className='navbar-start'>
                <label className='text-xl font-extrabold'>{APP_NAME}</label>
            </div>
            <div className='navbar-center'>
                <button disabled={!serviceAvailable} className={`btn p-2 ml-2`}>
                    <Link className="" to={'/login'}>
                        <Trans> Login</Trans>
                    </Link>
                </button>
                <button disabled={!serviceAvailable} className={`btn p-2 ml-2`}>
                    <Link to={'/register'}>
                       <Trans> Register</Trans>
                    </Link>
                </button>
                <button disabled={!serviceAvailable} className={`btn p-2 ml-2`}  onClick={navigateToDemoDashboard}>
                    <Link to={'/dashboard'}>
                        <Trans> Demo</Trans>
                    </Link>
                </button>
                <button className={`btn p-2 ml-2`}>
                    <Link to={'/about'}> <Trans> About</Trans>
                    </Link>
                </button>
                <button className={`btn p-2 ml-2`} onClick={()=>{
                    sessionStorage.clear();
                    localStorage.clear();
                    Cookies.remove('_m')
                }}>
                 Clear All cookies
                </button>
            </div>
            <div className='navbar-end text-xs max-w-1/4 '>
                <label className='px-2'>
                    <Trans>Language: </Trans>
                </label>
                <LanguageSelector/>
            </div>
        </div>
        <Outlet/>
    </div>
}

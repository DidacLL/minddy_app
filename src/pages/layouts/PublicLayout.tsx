import ScreenData from '../../data/classes/ScreenData';
import {Link, Outlet, useNavigate} from 'react-router-dom';
import {Trans} from '@lingui/macro';
import {LanguageSelector} from '../../components/toolbar/LanguageSelector';
import {APP_NAME} from '../../App';
import {useEffect, useState} from 'react';
import {MinddyManager} from "../../data/Minddy.manager";
import MinddyService from "../../data/minddy.service";

interface PublicLayoutParams {
    screenData: ScreenData,
    onServerError: (message: string) => void,
    demo: () => void
}

export function PublicLayout(props: PublicLayoutParams) {

    const [serviceAvailable, setServiceAvailable] = useState<boolean>(false);
    const navigate = useNavigate();
    const navigateToDemoDashboard = () => {
        props.demo();
        navigate('/dashboard');
    }
    useEffect(() => {
    }, [serviceAvailable]);
    useEffect(() => {
        MinddyService.ping().then(setServiceAvailable).catch((e)=>{
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

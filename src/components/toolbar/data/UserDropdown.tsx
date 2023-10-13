import React, {useEffect, useRef, useState} from "react";
import {Trans} from "@lingui/macro";
import {LanguageSelector} from "../LanguageSelector";
import {ThemeSelector} from "../ThemeSelector";
import {useNavigate} from "react-router-dom";
import {MinddyManager} from "../../../data/Minddy.manager";
import {UserIcon} from "@heroicons/react/20/solid";


export function UserDropdown(props:{manager: MinddyManager} ) {
    const nav=useNavigate();
    const dropdownRef = useRef<HTMLDetailsElement | null>(null);
    const [open, setOpen] = useState(false);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpen(false);
            dropdownRef.current.removeAttribute('open');
        }
    };

    const handleSummaryClick = (event: React.MouseEvent) => {
        event.preventDefault();
        setOpen(!open);
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return <details open={open} className="dropdown dropdown-bottom dropdown-end text-primary-content hover:text-secondary " ref={dropdownRef}>
        <summary tabIndex={0} className="flex " onClick={handleSummaryClick} >
            {/*<label className="btn btn-circle btn-ghost btn-xs sm:btn-sm  max-h-max hover:text-secondary ">*/}
                <UserIcon className='h-[2em] m-2'/>
            {/*</label>*/}
        </summary>
        <ul tabIndex={0}
            className="mt-3 mr-4 p-2 shadow menu dropdown-content rounded-box w-52 bg-primary text-primary-content ">
            <li>
                <label className="justify-between menu-title text-primary-content">
                    {props.manager.user.userName}
                    {/*{props.manager.getRootProject()&& props.manager.getRootProject().pendingTasks && props.manager.getRootProject().pendingTasks>0*/}
                    {/*    ?<span className="badge">ToDo</span>:""}*/}
                </label>
            </li>
            <li className="focus:outline-none focus:ring-0 menu-title text-primary-content">
                <label className="mb-2"><Trans>Language: </Trans></label>
                <label className="w-full menu-title"><LanguageSelector/></label>
            </li>
            <li className="menu-title text-primary-content">
                <label className="mb-2"><Trans>Theme:</Trans></label>
                <div  className="menu-title"><ThemeSelector/></div>
            </li>
            <li>
                <label
                    className="btn btn-warning hover:btn-error active:btn-primary btn-sm mt-4 focus:outline-none focus:ring-0 font-extrabold"
                    onClick={() => {
                        props.manager.logout();
                        nav("/")
                    }}>
                    <Trans>Logout</Trans>
                </label>
            </li>
        </ul>
    </details>;
}
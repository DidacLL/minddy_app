import React, {useEffect, useRef, useState} from "react";
import {AppData} from "../../data/classes/AppData";

interface ToolBarDropdownProps {
    name: string;
    appData: AppData,
    menu: () => React.JSX.Element
    iconJSX: React.JSX.Element
}

export function ToolBarDropdown(props: ToolBarDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const handleClickOutside = (event: MouseEvent) => {
        if (open && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setOpen(!open);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    useEffect(() => {

    }, [open]);
    return       <div className="dropdown  bg-primary dropdown-bottom dropdown-end align-middle ">

            {open &&
                <div tabIndex={0}
                     className=" dropdown-content text-primary-content rounded-b-box max-w-prose bg-primary z-10 "
                     onMouseLeave={()=>{if(open)setOpen(false)}}
                     ref={dropdownRef}>
                    <div className="menu menu-vertical menu-sm md:menu-md rounded-b-box">
                        {props.menu()}
                    </div>
                </div>
            }

        <button
            onClick={(e) => handleButtonClick(e)}
                onMouseLeave={(e) => {
                    try{
                    if (open && dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget as Node)) {
                        setOpen(false);
                    }}catch (ex) {
                    }
                }}
                className={`p-2 text-primary-content flex flex-nowrap btn-shadow mr-2 lowercase ${open? 'force-shadow-in' : 'tooltip tooltip-bottom'}`}
                style={{borderRadius:"4rem"}}
                data-tip={props.name.toLowerCase()}>
            {props.iconJSX}
            <label className="hidden 2xl:flex normal-case px-1">{props.name}</label>
        </button>
            </div>
}

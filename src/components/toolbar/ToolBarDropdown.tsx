import React, {useEffect, useRef, useState} from "react";
import {MinddyManager} from "../../data/Minddy.manager";

interface ToolBarDropdownProps {
    name: string;
    manager: MinddyManager,
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
    return       <div className="h-full dropdown bg-primary txt-s dropdown-bottom dropdown-end align-middle ">

            {open &&
                <div tabIndex={0}
                     className=" dropdown-content text-primary-content rounded-b-box max-w-prose bg-primary "
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
            // className={` txt-s text-primary-content flex flex-nowrap  mr-2 lowercase btn btn-xs tooltip tooltip-bottom ${minimized ? '' : 'force-shadow-in'}`}

            className={`h-full  text-primary-content flex flex-nowrap btn btn-xs btn-shadow mr-2 lowercase ${open? 'force-shadow-in' : 'tooltip tooltip-bottom'}`}
                // style={{borderRadius:"4rem"}}
                data-tip={props.name.toLowerCase()}>
            <div className='h-full w-[2em] flex grow '>{props.iconJSX}</div>
            <label className="hidden 2xl:flex normal-case px-1">{props.name}</label>
        </button>
            </div>
}

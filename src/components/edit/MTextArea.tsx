import React, {useEffect, useState} from "react";
import { i18n } from "@lingui/core";
import { t, Trans } from "@lingui/macro";
import ResponsiveText from "../../data/classes/utils/ResponsiveText";
import {InformationCircleIcon} from "@heroicons/react/24/outline";

interface MTextAreaParams {
        name: string;
        onChange: (val: string) => void;
        maxChar: number;
        initialValue?: string;
        onError?: (err: any) => any;
        tip?: string;
        placeHolder?: string;
        clazzName?: string;
}

export function MTextArea(props: MTextAreaParams) {

    const [currentValue, setCurrentValue] = useState(props.initialValue||'');
    const [showError, setShowError] = useState<boolean>(false)


    const [toggleHelp, setToggleHelp] = useState(false);
    useEffect(() => {

    }, [toggleHelp]);
    useEffect(() => {
        props.onChange(currentValue)
    }, [currentValue]);

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        let val = event.target.value;
        const legalLength = val.length <= props.maxChar;
        setShowError(!legalLength)
        if (legalLength)setCurrentValue(val)
    }

    return <div className={`z-10 relative overflow-visible w-auto form-control input-group-sm h-min rounded-box py-2 pl-1 pr-3 m-2 ${showError && 'input-error'} ${props.clazzName}`}>

        <label className="txt-l whitespace-nowrap label rounded-l-box menu-title h-full">
            <ResponsiveText text={<span>{props.name}</span>} max={100} min={16}/>
        </label>
        <textarea placeholder={props.placeHolder} value={currentValue} onChange={handleChange}
               className={`ml-10 mb-0 bg-base-300  h-max resize p-2 input-sm input input-bordered max-w-prose w-max `}/>

        <label className='label ml-10 w-auto whitespace-nowrap justify-between'>
            <span className="label-text-alt">length:{currentValue.length}/{props.maxChar}</span>
            <span className={`label-text-alt  ${toggleHelp && ' tooltip tooltip-left tooltip-open'}`} data-tip={props.tip} onClick={()=>setToggleHelp(!toggleHelp)}>
                <InformationCircleIcon className={`hover:scale-90 w-[1em] txt-xl stroke-2 m-2 ${toggleHelp && 'invert'}`}></InformationCircleIcon>
            </span>
        </label>

        <div className='absolute -z-10 mask-frame bg-base-200  w-full h-full '></div>
    </div>;
}

import React, {useEffect, useState} from "react";
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import ResponsiveText from "../data/classes/utils/ResponsiveText";
import {ProjectState} from "../data/enums/ProjectState";

interface EnumSelectorProps<T> {
    title: string;
    values: T[]
    names: string[];
    onChange: (val: T) => void;
    initialValue?: number;
    onError?: (err: any) => any;
    tip?: string;
    clazzName?: string
}

export function EnumSelector<T>(props: EnumSelectorProps<T>) {

    const width = props.title.length;

    const [selected, setSelected] = useState<number>(props.initialValue||0);
    const [toggleHelp, setToggleHelp] = useState(false);
    useEffect(() => {
        if (selected) {
        console.log('selected is:' +selected)
            const val = selected as T;
        console.log('val:' +val)
            props.onChange(val)
        }
    }, [selected]);
    // useEffect(() => {

        // if(props.initialValue)setSelected(props.initialValue);
    // }, []);
    useEffect(() => {
        // if(props.initialValue)setSelected(props.initialValue);
    }, [toggleHelp, props,props.initialValue]);

    useEffect(() => {

        setSelected(ProjectState[selected] as unknown as number)
    }, []);
    return <div
        className={`z-10 relative overflow-visible max-w-[${width / 2}em] w-auto form-control input-group-sm h-min rounded-box py-2 pl-1 pr-3 m-2 `}>
        <label className="txt-l whitespace-nowrap label rounded-l-box menu-title h-full">
            <ResponsiveText text={<span>{props.title}</span>} max={100} min={16}/>

        </label>
        <select className=" ml-10 select select-bordered w-max"
                onClick={e => setToggleHelp(false)}
                onChange={(v) => {
                    setSelected(v.target.value as unknown as number)
                }}
                value={selected as number}>

            {
                props.names.map((v, index) => <option className='btn btn-sm' value={index}>{v}</option>)
            }
        </select>
        <label className="label">
            <span className="label-text-alt"></span>
            <span className={`label-text-alt  ${toggleHelp && ' tooltip tooltip-left tooltip-open'}`}
                  data-tip={props.tip} onClick={() => setToggleHelp(!toggleHelp)}>
                <InformationCircleIcon
                    className={`hover:scale-90 w-[1em] txt-xl stroke-2 m-2 ${toggleHelp && 'invert'}`}></InformationCircleIcon>
            </span>
        </label>

    </div>;
}
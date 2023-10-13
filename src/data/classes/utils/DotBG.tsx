import React, {useEffect, useState} from "react";
import {getTxtSize} from "./Tools";

export function DotBG(props: {
    opacity?: number,
    dotColor?: string,
    size?: number,
    bgColor?: string,
    clazzName?: string
}) {

    const [size, setSize] = useState(0);

    useEffect(() => {
        props.size && setSize(props.size);
    }, []);

    useEffect(() => {
        props.size && setSize(props.size);
    }, [props.size]);
    return <div
        className={` pointer-events-none  bg-${props.bgColor ? props.bgColor : 'transparent'} ${props.dotColor && ('text-' + props.dotColor)} bg-dot  opacity-${props.opacity+'' || '100'} absolute ${props.dotColor && ('text-' + props.dotColor)} txt-${getTxtSize(size)} ${props.clazzName?props.clazzName:'w-full h-full '}`}>

    </div>;
}
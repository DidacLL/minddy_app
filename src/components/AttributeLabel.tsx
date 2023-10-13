import {Trans} from "@lingui/macro";

export function AttributeLabel(props: { text: string, clazzName?:string }) {
    return <label className={`txt-s -ml-2 max-h-fit text-neutral ${props.clazzName}`}><Trans>{props.text}</Trans>:</label>;
}
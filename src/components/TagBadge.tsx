export function TagBadge(props: { tagName: string, editMode?: boolean, clazzName?: string,clickHandle?: (e: React.MouseEvent<any>)=>any }) {
    return <label
        className={`mx-2  p-1 btn-shadow badge badge-sm lowercase select-none rounded-badge bg-primary font-mono font-bold ${props.editMode ? '' : 'hover:-translate-y-1 '} ${props.clazzName}`}
        onClick={e=>{if(!props.editMode && props.clickHandle)props.clickHandle(e)}}

    >
        #{props.tagName}{props.editMode && props.clickHandle &&
        <div className='btn btn-circle  badge txt-3xl font-bold font-mono hover:bg-secondary select-none btn-xs scale-50'
             onClick={e=>{if(props.clickHandle)props.clickHandle(e)}}
        >
            x
        </div>}
    </label>;
}
import React, {useEffect, useRef, useState} from "react";


interface Props {
    content: React.JSX.Element | undefined,
    getRef: (modal: React.MutableRefObject<HTMLDialogElement | null>) => any;
    // openCallback:()=>{}
    open?: boolean;
}

export function FullPageModal(props: Props) {
    const modal = useRef<HTMLDialogElement>(null);
    const box = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(props.open || false);


    function handleClickOutside(event: MouseEvent) {
        if (modal.current && box.current && !box.current.contains(event.target as Node)) {
            setOpen(false);
            modal.current.close();
        }
    }

    useEffect(() => {
        setOpen(modal.current !== null && modal.current.open)
    }, [modal.current?.open]);

    useEffect(() => {

        modal.current && props.getRef(modal)
        setOpen(modal.current !== null && modal.current.open)
    }, [modal.current]);

    useEffect(() => {
        let currentBox=modal.current;
        if (currentBox !==null) {
            currentBox.addEventListener("mousedown", handleClickOutside)
        }
        return ()=>{
            currentBox?.removeEventListener("mousedown", handleClickOutside)
        }
    }, []);

    useEffect(() => {
        open ? modal.current?.showModal() : modal.current?.close();
    }, [open]);

    return <dialog ref={modal} className="modal bg-dot dot-s bg-base-300/80 text-main-dark p-0 m-0">
        <div ref={box} className="lg:modal-box  min-w-fit max-w-prose  flex flex-col p-0 m-0 overflow-y-scroll no-scrollbar bg-base-100 h-full ">
            <div className=' z-10 text-right bg-transparent absolute right-2 top-2' >
                {/* if there is a button in form, it will close the modal */}
                <button onClick={()=>modal.current?.close()}
                    className="btn  btn-sm btn-circle btn-ghost p-2 -m-2 hover:text-primary hover:bg-transparent">✕

                </button>
            </div>
            <div className=' w-full h-full lg:-mt-6 overflow-hidden '>
                {props.content}
            </div>
        </div>
    </dialog>


}


import React, {useEffect, useRef, useState} from "react";


interface Props {
    content: React.JSX.Element | undefined,
    getRef: (modal: React.MutableRefObject<HTMLDialogElement | null>) => any;
    // openCallback:()=>{}
    open?: boolean;
}

export function ConfirmationModal(props: Props) {
    const modal = useRef<HTMLDialogElement>(null);
    const box = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(props.open || false);


    function handleClickOutside(event: MouseEvent) {
        if (box.current && !box.current.contains(event.target as Node)) {
            setOpen(false);
            modal.current?.close();
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

    return <dialog ref={modal} className="modal bg-base-300/60">
        <div ref={box} className="modal-box max-w-3xl h-full">
            <form method="dialog" >
                {/* if there is a button in form, it will close the modal */}
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 hover:text-primary hover:bg-transparent">✕
                </button>
            </form>
            {props.content}
        </div>
    </dialog>


}


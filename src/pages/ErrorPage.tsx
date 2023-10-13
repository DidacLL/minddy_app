import React from "react";

export function ErrorPage(props: { error: string }) {
    return <div className='text-error text-lg w-full h-full text-center pt-[40%]'>{props.error} </div>;
}
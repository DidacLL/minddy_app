import React, {useEffect, useRef, useState} from "react";
import {ObjectCard} from "./ObjectCard";
import {MinddyObject} from "../../data/classes/dao/MinddyObject";
import {PagedResponse} from "../../data/classes/dto/PagedResponse";
import {ObjectMinimal} from "../../data/classes/dto/ObjectMinimal";
import {LoadState} from "../../data/enums/LoadState";

export function ObjectLoader<T extends MinddyObject>(props: {
    pageFunction: (callBack: (page: PagedResponse<ObjectMinimal>) => any, error: (e: any) => any, size?: number, page?: number) => any,
    getFunction: (id: string, callback: (element: T) => any, error: (e: any) => any) => void,
    isExpanded: boolean,
    size: number,
}) {
    //-----------------REFERENCES

    //----------------CONTENT VARIABLES
    // const [size, setSize] = useState<number>(10);
    const [page, setPage] = useState<PagedResponse<{ id: string }>>();

    const [cards, setCards] = useState<React.JSX.Element[]>([]);
    const ref = useRef<HTMLDivElement>(null);
    const [container, setContainer] = useState<HTMLDivElement>();
    //----------------------------------------------------COMPONENT STATE
    const [loadState, setLoadState] = useState<LoadState>(LoadState.LOADING);
    //------------------------------------------------------------------USE EFFECT
    useEffect(() => {
        setContainer(ref.current?.parentElement as HTMLDivElement)
        props.pageFunction(v => {
            setLoadState(LoadState.LOADED)
            setPage(v)
        }, (e) => setLoadState(LoadState.ERROR), props.size, 0)
        // const container = ref.current?.parentElement;
        let handleScroll: () => void;
        if(container) {
            handleScroll = () => {
                if (page && page.number < page.totalPages) {
                    if (container && container.scrollWidth - Math.ceil(container.clientWidth*1.3)<=container.scrollLeft) {
                        setLoadState(LoadState.LOADING)
                        props.pageFunction(v => {
                            setLoadState(LoadState.LOADED)
                            setPage(v)
                        }, (e) => setLoadState(LoadState.ERROR), props.size || 10, page.number + 1);
                    }
                }
            };

            container.addEventListener('scroll', handleScroll);
        }
        // Limpiar el evento al desmontar el componente
        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (loadState === LoadState.LOADED) {
            setCards(cards.concat(createNewCards()))
        }
    }, [page]);

    useEffect(() => {

    }, [cards]);


    useEffect(() => {

    }, [ref]);

    function createNewCards() {
        const resVal: React.JSX.Element[] = [];
        if (page && loadState) {
            for (let i = 0; i < page.numberOfElements; i++) {
                const obj = page.content.at(i);
                if (obj)
                    resVal.push(
                        <ObjectCard getter={props.getFunction} id={obj.id}></ObjectCard>
                    );
            }
        }
        return resVal
    }

    {/*return <div className=' flex flex-shrink bg-warning gap-4  '>*/
    }
    return <div ref={ref}
                className={`rounded flex flex-grow text-center gap-4 ${props.isExpanded ? ' flex-col ' : 'flex-nowrap'}`}
    >
        {cards}
    </div>

}

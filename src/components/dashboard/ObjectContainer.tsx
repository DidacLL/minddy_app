import {MinddyObject} from "../../data/classes/dao/MinddyObject";
import {MinddyManager} from "../../data/Minddy.manager";
import {PagedResponse} from "../../data/classes/dto/PagedResponse";
import {ObjectMinimal} from "../../data/classes/dto/ObjectMinimal";
import React, {useEffect, useRef, useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon} from "@heroicons/react/20/solid";
import {ObjectCard} from "./ObjectCard";
import ResponsiveText from "../../data/classes/utils/ResponsiveText";
import {Simulate} from "react-dom/test-utils";
import {Trans} from "@lingui/macro";
import {useParams} from "react-router-dom";

enum ContainerMode {
    LOADING = 0, EMPTY = 1, MIN = 2, SCROLL = 3, MAX = 4
}

interface ObjectContainerProps<T extends MinddyObject> {
    label: string;
    manager: MinddyManager;
    pageFunction: (callBack: (page: PagedResponse<ObjectMinimal>) => any, error: (e: any) => any, size: number, page: number) => any;
    getFunction: (id: string, callback: (element: T) => any, error: (e: any) => any) => void;
    onMinimize?: (param?: any) => any;
    onExpand?: (param?: any) => any;
    onEmpty?: (param?: any) => any;
    onError?: (param?: any) => any;
    onObjectClick?: (param?: any) => any;
    pageSize?: number;
    startPage?: number;
    bgColor?: string;
    scrollColor?: string;
    clazzName?: string;
}

interface CounterBadgeProps {
    value: string
}

function CounterBadge({value}: CounterBadgeProps) {
    return <div className="mx-2  min-w-[3em]  badge badge-outline badge-neutral hover:text-opacity-60 active:force-shadow-in">{value}</div>;
}

export function ObjectContainer<T extends MinddyObject>(props: ObjectContainerProps<T>) {


    const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(null);

    const [objects, setObjects] = useState<React.JSX.Element[]>([]);
    const scrollerRef = useRef<HTMLDivElement>(null);

    const [lastCard, setLastCard] = useState<HTMLDivElement | null>(null);
    const [mode, setMode] = useState<number>(ContainerMode.LOADING);
    const [page, setPage] = useState<PagedResponse<ObjectMinimal>>();
    const haveNext = () => page && page.number + 1 < page.totalPages
    const mainClazz = `bg-${props.bgColor || 'primary'} ${props.clazzName || ''}`;
    const titleStyle = (isVertical?: boolean) => `mask-frame max-w-min max-h-min flex align-middle -mt-3 -mb-1  text-5xl font-extrabold justify-self-start font-sans text-base-100 whitespace-nowrap ${isVertical ? '-rotate-90  origin-top-left -ml-[0.8rem] mt-[0.2rem] ' : ''}`


    function loadPage(num: number) {
        props.pageFunction((p) => {
            setPage(p)
            setMode(p.totalElements > 0 ? Math.max(mode, ContainerMode.MIN) : ContainerMode.EMPTY);
        }, props.onError ? props.onError : (e) => {
            setMode(ContainerMode.EMPTY)
        }, page ? page.size : props.pageSize || 10, num)
    }


    const startScrolling = (isRight: boolean) => {
        function getScrollLeft(val: number) {
            return Math.max(Math.ceil((scrollerRef.current?.scrollWidth ? scrollerRef.current.scrollWidth : 1000) / 1000 + val / 10), 1);

        }

        if (isRight ? !isScrollEnd() : (scrollerRef.current && scrollerRef.current.scrollLeft > 0)) {

            let val = 0

            setScrollInterval(setInterval(() => {
                if (scrollerRef && scrollerRef.current && ((scrollerRef.current.scrollLeft > 0 && !isRight) || (scrollerRef.current.scrollLeft < scrollerRef.current.scrollWidth && isRight))) if (isRight) {
                    scrollerRef.current.scrollLeft += getScrollLeft(val++)
                    // if (isScrollEnd()) loadPage();
                } else {
                    scrollerRef.current.scrollLeft -= getScrollLeft(val++)
                }
            }, Math.min(2, 100 - val)));
        }
    }

    const stopScrolling = () => {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            setScrollInterval(null);
        }
        if (page && isScrollEnd() && haveNext()) loadPage(page.number + 1)
    }

    function createNewCards() {
        const resVal: React.JSX.Element[] = [];
        if (page) {
            for (let i = 0; i < page.content.length; i++) {
                const obj = page.content.at(i);
                if (obj) resVal.push(<ObjectCard key={props.label + '_' + obj.id + '_' + (new Date().getMilliseconds())}
                                                 setRef={(v) => setLastCard(v)}
                                                 getter={props.getFunction} id={obj.id} manager={props.manager}
                                                 width={16}
                                                 height={12}
                                                 clazzName='text-primary-content'/>);
            }
        }
        return resVal
    }

    function handleArrow(isRight: boolean) {
        if (scrollerRef.current && (isRight ? !isScrollEnd() : scrollerRef.current.scrollLeft > 0)) {
            stopScrolling();
            scrollerRef.current.scrollLeft += isRight ? (lastCard ? lastCard.offsetWidth * 2 : 120) : ((lastCard?.offsetWidth || 64) * -1);
        }
    }

    function generatePageNumbers() {
        let retVal: React.JSX.Element[] = [];
        if (page && mode === ContainerMode.MAX) {
            for (let i = 0; i < page.totalPages; i++) {
                retVal.push(<div
                    onClick={() => loadPage(i)}
                    className={`join-item  btn btn-xs btn-round btn-shadow btn-ghost p-2 mb-2 ${page.number === i ? 'txt-sb force-shadow-in text-main-dark ' : 'txt-s '}`}>
                    {i}
                </div>)
            }
        }
        return retVal;
    }

    function isScrollEnd() {
        return scrollerRef.current && scrollerRef.current.scrollWidth - scrollerRef.current.scrollLeft <= scrollerRef.current.clientWidth + 5;
    }

//------------------------------------------------MOUNT


    useEffect(() => {
        setMode(ContainerMode.LOADING)
        loadPage(0);
    }, []);

    useEffect(() => {
        setMode(ContainerMode.LOADING)
        loadPage(0)
    }, [props]);
    //------------------------------------------------LOAD PAGE
    const totalElements = () => {
        if (page) return page.totalElements;
    }
    useEffect(() => {
        if (page && mode > ContainerMode.EMPTY) {
            setObjects(mode >= ContainerMode.MAX ? createNewCards() : objects.concat(createNewCards()))
        }
    }, [page]);
    //------------------------------------------------ON MINIMIZE
    useEffect(() => {
        switch (mode) {
            case ContainerMode.LOADING:
                break;
            case ContainerMode.EMPTY:
                break;
            case ContainerMode.MIN:
                props.onMinimize?.()
                break;
            case ContainerMode.SCROLL:
                if(!isEmpty()){setObjects([])
                loadPage(0)}
                break;
            case ContainerMode.MAX:
                props.onExpand?.();
                setObjects([])
                loadPage(page?.number||0);
                break;
        }

    }, [mode]);

    //------------------------------------------------ON EMPTY
    function isEmpty() {

        return page && page.totalElements <= 0;
    }

//------------------------------------------------UPDATE OBJECTS
    switch (mode) {
        case ContainerMode.MAX:
            //----------------------------------------------------------------------------------------------------------EXPANDED
            return <div className={`flex flex-col min-h-[10rem]  min-w-[10rem] ${mainClazz}`}>
                {/*---------------------------TITLE BAR---------------------------*/}
                <div className={`flex flex-nowrap justify-between w-full h-full `}>
                    <div
                        onClick={() => {
                            setMode(ContainerMode.SCROLL)
                        }}
                        className={` ${titleStyle(false)}`}>
                        {props.label}
                    </div>
                    <div className={` mt-0 h-min `}>
                        <div className={`grow flex justify-end `}>
                            <MinusIcon className='w-[1rem] hover:text-neutral'
                                       onClick={() => setMode(ContainerMode.SCROLL)}/>
                        </div>
                    </div>
                </div>
                {/*--------------------------- BODY ---------------------------*/}
                <div
                    className={`grid grid-cols-[repeat(auto-fill,minmax(10em,1fr))] gap-[2rem] grid-flow-row-dense justify-center align-middle flex-wrap p-[0.5rem] m-[0.5rem]   bg-dot dot-s text-base-300/50  mask-fade-x`}>
                    {objects}
                </div>
                <div className='w-full h-min flex justify-center join'>
                    {generatePageNumbers()}
                </div>
            </div>
        case ContainerMode.SCROLL:
            //----------------------------------------------------------------------------------------------------------SCROLL
            return <div className={` flex flex-col min-h-[10rem] min-w-[10rem] max-w-full w-full  ${mainClazz}`}>
                {/*---------------------------TITLE BAR---------------------------*/}
                <div className={`relative w-full h-full `}>
                    <div
                        className='absolute  justify-items-start translate-y-full  w-auto h-auto  min-h-[10rem]  min-w-[10rem] '>
                        <div className={` h-full ${titleStyle(true)}`}
                             onClick={() => {
                                 setMode(ContainerMode.MIN)
                             }}>
                            {props.label}
                        </div>
                    </div>
                    <div className={`w-full mt-0 h-min absolute top-0 origin-right right-0`}>
                        <div className={`grow h-full flex justify-end `}>
                            <MinusIcon className='w-[1rem] hover:text-neutral'
                                       onClick={() => setMode(ContainerMode.MIN)}/>
                            <PlusIcon className='w-[1rem] hover:text-neutral'
                                      onClick={() => setMode(ContainerMode.MAX)}/>
                        </div>
                    </div>
                </div>
                {/*--------------------------- BODY ---------------------------*/}
                <div className='pl-10 flex w-full h-full align-middle items-center overflow-hidden'>
                    <div className='w-min h-full  justify-items-center flex '>
                        <ChevronLeftIcon
                            className={`w-[2rem] hover:text-neutral touch-pinch-zoom active:-ml-1 active:mr-1 ${(isEmpty() || (scrollerRef.current && scrollerRef.current.scrollLeft <= 2)) && 'opacity-0'}`}
                            onClick={(e) => {
                                // e.preventDefault();
                                handleArrow(false);
                            }}
                            // onPointerDown={e=>e.preventDefault()}
                            // onContextMenu={e=>e.preventDefault()}
                            onMouseEnter={() => startScrolling(false)}
                            onMouseLeave={stopScrolling}
                        />
                    </div>
                    {isEmpty() ?
                        <div
                            className='grow m-4 p-[4em] bottom-0 text-right align-middle font-mono font-bold justify-center opacity-50 bg-dot dot-s text-base-300/50'>
                            <ResponsiveText text={<Trans>Nothing there...</Trans>} max={120} min={10}
                                            clazzName=' text-primary-content/50  '/>
                            <label className='badge badge-sm btn-shadow'> add new </label>
                        </div>
                        :
                        <div ref={scrollerRef}
                             className=' mask-fade-x mask-border-right flex w-full gap-4 py-2 my-2 overflow-x-scroll no-scrollbar  px-4  bg-dot dot-s text-base-300/50 '>
                            {objects}

                        </div>
                    }
                    <div className='w-min h-full  justify-items-center flex select-none '
                         onClick={(e) => {
                             handleArrow(true);
                         }}
                         onMouseEnter={() => startScrolling(true)}
                         onMouseLeave={stopScrolling}
                    >
                        <ChevronRightIcon
                            className={`w-[2rem] hover:text-neutral active:-mr-2 active:ml-2 ${(!page || mode <= ContainerMode.EMPTY || isEmpty() || isScrollEnd()) && 'opacity-0'}`}/>
                    </div>
                </div>
            </div>
        case ContainerMode.MIN:
            //--------------------------------------------------------------------------------------------------------------MINIMIZED
            return <div className='flex rounded-box'>
                <div className={`w-min mask-frame h-min rounded-box ${mainClazz}`}
                     onClick={() => setMode(ContainerMode.SCROLL)}>
                    {/*---------------------------TITLE BAR---------------------------*/}
                    <div className={`place-items-center justify-between  align-middle h-min flex flex-row  w-full`}>
                        <div  className={titleStyle()}>
                            {props.label}
                        </div>

                        <CounterBadge value={isEmpty()?'∅': totalElements()+''}/>
                        {/*{!isEmpty() && <PlusIcon className='m-2 w-[1rem] hover:text-neutral'*/}
                        {/*              onClick={() => setMode(ContainerMode.SCROLL)}/>}*/}
                    </div>
                </div>
                {/*{page && page.totalElements > 0 && <div*/}
                {/*    className='mx-2 badge relative badge-neutral border-transparent   -inset-x-3 -inset-y-2'>{totalElements()}</div>}*/}
            </div>
        case ContainerMode.EMPTY:
            //--------------------------------------------------------------------------------------------------------------EMPTY
            return <div className='flex rounded-box'>
                <div className={`w-min mask-frame h-min rounded-box ${mainClazz}`} onClick={() => setMode(ContainerMode.SCROLL)}>
                    {/*---------------------------TITLE BAR---------------------------*/}
                    <div className={`place-items-center justify-between  align-middle h-min flex flex-row  w-full`}>
                        <div className={titleStyle()}>
                            {props.label}
                        </div>

                        <CounterBadge value={'∅'}/>
                    </div>
                </div>
            </div>
        default:     //--------------------------------------------------------------------------------------------------------------LOADING
            return <div className={`w-[10em] h-auto ${mainClazz}`}>
                <div className='flex grow align-middle justify-center '>
                    <div className='loading loading-bars '>
                    </div>
                </div>
            </div>
    }
}
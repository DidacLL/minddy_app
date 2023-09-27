import React, {useEffect, useRef, useState} from "react";
import Task from "../../data/classes/bussiness/Task";
import {TaskCard} from "./TaskCard";
import {MinddyManager} from "../../data/Minddy.manager";
import {PagedResponse} from "../../data/minddy.service";
import {ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon} from "@heroicons/react/20/solid";
import {MinddyObject} from "../../data/classes/bussiness/MinddyObject";

export function HorizontalScroller(props: { label: string, manager: MinddyManager ,elements:string[]}) {

    const menuRef = useRef<HTMLDivElement | null>(null);
    const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(null);
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        stopScrolling()
        isDragging = true;
        startX = e.pageX - (menuRef.current?.offsetLeft || 0);
        scrollLeft = menuRef.current?.scrollLeft || 0;
    };

    const handleMouseUp = () => {
        isDragging = false;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !menuRef.current) return;
        e.preventDefault();
        stopScrolling()
        const x = e.pageX - (menuRef.current.offsetLeft || 0);
        const walk = (x - startX) * 3;
        menuRef.current.scrollLeft = scrollLeft - walk;
    };
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        stopScrolling()
        if (menuRef.current) menuRef.current.scrollLeft += e.deltaY;
    };
    const handleArrow = (isRight: boolean) => {
        if (menuRef.current) {
            // stopScrolling()
            isRight ?
                menuRef.current.scrollTo(menuRef.current.scrollWidth,0)
                :
                menuRef.current.scrollTo(0,0)
        }
    }

    const startScrolling = (isRight: boolean) => {
        function getScrollLeft(val:number) {
            return Math.max(Math.ceil((menuRef.current?.scrollWidth ? menuRef.current.scrollWidth : 1000) / 1000 + val / 10), 1);
        }
        let val=0

        setScrollInterval(setInterval(() => {
                // console.log(val)
            if (menuRef && menuRef.current && ((menuRef.current.scrollLeft>0&&!isRight)||(menuRef.current.scrollLeft<menuRef.current.scrollWidth && isRight)))
                isRight ?
                    menuRef.current.scrollLeft+=getScrollLeft(val++)
                    :
                    menuRef.current.scrollLeft-=getScrollLeft(val++)
        }, Math.min(2,100-val)));
    }

    const stopScrolling = () => {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            setScrollInterval(null);
        }
    }


    const [elements, setElements] = useState<MinddyObject[]>();
    const [size, setSize] = useState<number>(10);
    const [page, setPage] = useState<PagedResponse<Task>>();


    const [minimized, setMinimized] = useState(false);
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        props.elements.map(v=>props.manager.taskPool.get(v))
    }, [props.manager.currentProject, props.manager.user.token]);

    useEffect(() => {
        // tasks?.map((t)=>{
        //     try {
        //     t.load(props.manager.user.token,()=>{})
        //     }catch (e) {
        //
        //     }
        // })
    }, [elements   ]);
    const taskCards: React.JSX.Element[] | undefined = elements?.map((t) => <TaskCard task={t as Task}/>);
    return (
        <div
            className={`flex ${props.manager.screen.isHorizontal() ? 'flex-row' : 'flex-col'} justify-start items-center w-[100%] bg-base-300 rounded-box p-1`}>
            {/*TITLE -----------------------------------------*/}
            <div className={`justify-self-start max-h-min ${props.manager.screen.isHorizontal() && !minimized ?
                "transform -rotate-90 origin-center relative -mr-24 -inset-x-16 "
                :
                'flex flex-row -mt-2 w-full'}`}>
                <label
                    onClick={()=>{
                        if(minimized || expanded){
                            setMinimized(false)
                            setExpanded(false)
                        }
                        else {
                            const aux=props.manager.screen.isVertical()
                            setMinimized(!aux)
                            setExpanded(aux)
                        }
                    }}
                    className="text-5xl font-extrabold font-sans text-base-100 whitespace-nowrap overflow-hidden -m-2 ">
                    {props.label}
                </label>

            {/*MIN-MAX-----------------------------------------*/}
                {props.manager.screen.isVertical() && <div className='grow h-full flex justify-end inset-x-6 mt-2'>
                    {!minimized && <MinusIcon className='btn btn-xs btn-ghost '
                                              onClick={() => {
                                                  if (expanded) setExpanded(false)
                                                  else setMinimized(true)
                                              }}
                    />}
                    {!expanded && <PlusIcon className='btn btn-xs btn-ghost'
                                            onClick={() => {
                                                if (minimized) setMinimized(false)
                                                else setExpanded(true)
                                            }}
                    />}
                </div>}
            </div>
            <div className={ `${props.manager.screen.isVertical()?'items-between':''} max-w-full pr-10  flex flex-row place-items-center`}>
            {!minimized && !expanded && <ChevronLeftIcon className="btn btn-ghost btn-xs btn-circle  text-primary font-black stroke-2 stroke-primary hover:bg-primary-content/80"
                                                          onClick={() => handleArrow(false)}
                                                          onMouseEnter={() => startScrolling(false)}
                                                          onMouseUp={stopScrolling}
                                                          onMouseLeave={stopScrolling}/>
            }
            {!minimized && <div
                className={`rounded flex flex-row max-w-full text-center gap-4 p-4 ${expanded?' h-fill flex-wrap content-around align-middle': ' overflow-x-scroll no-scrollbar flex-nowrap'}`}
                ref={menuRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                {taskCards?.map(el => el)}
            </div>}
            {!minimized && !expanded && <ChevronRightIcon className=" btn btn-ghost btn-xs btn-circle  text-primary font-black stroke-2 stroke-primary hover:bg-primary-content/80"
                              onClick={() => handleArrow(true)}
                              onMouseEnter={() => startScrolling(true)}
                              onMouseUp={stopScrolling}
                              onMouseLeave={stopScrolling}/>
            }
            </div>
        </div>
    );
}
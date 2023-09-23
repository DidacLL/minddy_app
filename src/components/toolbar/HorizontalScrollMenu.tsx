import React, {useRef, useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/20/solid";

export function HorizontalScrollMenu(props: { icons: React.JSX.Element[] }) {
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
        setScrollInterval(setInterval(() => {
            if (menuRef && menuRef.current && ((menuRef.current.scrollLeft>0&&!isRight)||(menuRef.current.scrollLeft<menuRef.current.scrollWidth && isRight)))
                isRight ?
                    menuRef.current.scrollLeft++
                    :
                    menuRef.current.scrollLeft--;
        }, 3));
    }

    const stopScrolling = () => {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            setScrollInterval(null);
        }
    }

    return <div className=" max-w-full  flex items-center ring-2 ring-primary-light bg-secondary rounded-box text-secondary-content/70 drop-shadow-lg shadow-main-dark shadow-inner ">
        <ChevronLeftIcon className="btn btn-ghost btn-xs btn-circle  text-primary stroke-2 stroke-primary hover:bg-main-light/80"
                         onMouseDown={() => handleArrow(false)}
                         onMouseEnter={() => startScrolling(false)}
                         onMouseUp={stopScrolling}
                         onMouseLeave={stopScrolling}/>
        <div
            ref={menuRef}
            className='mx-2 md:flex gap-x-0.5 overflow-x-scroll overflow-y-hidden no-scrollbar scroll-auto hidden max-w-sm md:max-w-md lg:max-w-lg'
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >

            {props.icons.map(e => e)}
        </div>
        <ChevronRightIcon className="btn btn-ghost btn-xs btn-circle  htext-primary font-black stroke-2 stroke-primary hover:bg-primary-content/80"
                          onClick={() => handleArrow(true)}
                          onMouseEnter={() => startScrolling(true)}
            // onTouchStart={()=>startScrolling(true)}
                          onMouseUp={stopScrolling}
            // onTouchEnd={stopScrolling}
                          onMouseLeave={stopScrolling}/>
    </div>
}

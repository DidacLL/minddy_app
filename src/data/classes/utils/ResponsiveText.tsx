import React, {useEffect, useRef, useState} from 'react';

interface ResponsiveTextProps {
    text: React.JSX.Element,
    max: number,
    min: number,
    clazzName?: string;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = (props: ResponsiveTextProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLSpanElement | null>(null);
    const [size, setSize] = useState<number>();

    useEffect(() => {
        const resizeText = () => {
            if (containerRef.current && textRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const textWidth = textRef.current?.offsetWidth;
                if (textWidth > containerWidth) {
                    textRef.current.style.fontSize = `${Math.ceil(containerWidth / textWidth) * 100}%`;
                    setSize(containerWidth);
                } else {
                    const size =
                        Math.floor(
                            Math.max(
                                Math.min(
                                    props.max,
                                    Math.ceil(
                                        Math.max(1,containerRef.current.clientWidth) / Math.max(1,(props.text+'').length)
                                    )
                                ),
                                props.min
                            )
                        );
                    containerRef.current.style.fontSize = `${size}px`;
                    containerRef.current.style.marginTop=`-0.5em`
                    setSize(size);
                }
            }
            setSize(100)
        };

        window.addEventListener('resize', resizeText);
        resizeText();

        return () => window.removeEventListener('resize', resizeText);
    }, []);

    useEffect(() => {
    }, [size]);
    return <div ref={containerRef} className={` w-full items-start ${props.clazzName}`}>
            <span ref={textRef} className="">{props.text}</span>
        </div>

};

export default ResponsiveText;

import {useEffect, useState} from "react";
import {useMediaQuery} from 'react-responsive';
import {ScreenType} from "../enums/ScreenType";
import ScreenData from "../classes/utils/ScreenData";

export const useScreenInfo = () => {
    const [orientation, setOrientation] = useState(window.screen.orientation.type);
    const [windowSize, setWindowSize] = useState({width: window.innerWidth, height: window.innerHeight});
    const [isFullScreen, setIsFullScreen] = useState(window.innerWidth === window.screen.width && window.innerHeight === window.screen.height);

    useEffect(() => {
        const handleOrientationChange = () => setOrientation(window.screen.orientation.type);
        window.addEventListener('orientationchange', handleOrientationChange);
        return () => window.removeEventListener('orientationchange', handleOrientationChange);
    }, []);

    useEffect(() => {
        const handleResize = () => {
                setWindowSize({width: window.innerWidth, height: window.innerHeight});
                setIsFullScreen(window.innerWidth === window.screen.width && window.innerHeight === window.screen.height);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const isMobileDevice = useMediaQuery({query: '(min-device-width: 480px)'});
    const isTabletDevice = useMediaQuery({query: '(min-device-width: 768px)'});
    const isLaptop = useMediaQuery({query: '(min-device-width: 1024px)'});
    const isDesktop = useMediaQuery({query: '(min-device-width: 1200px)'});
    const isBigScreen = useMediaQuery({query: '(min-device-width: 1201px)'});

    let screenSize: ScreenType;
    if (isBigScreen) {
        screenSize = ScreenType.BIG_SCREEN;
    } else if (isDesktop) {
        screenSize = ScreenType.DESKTOP;
    } else if (isLaptop) {
        screenSize = ScreenType.LAPTOP;
    } else if (isTabletDevice) {
        screenSize = ScreenType.TABLET;
    } else if (isMobileDevice) {
        screenSize = ScreenType.MOBILE;
    }else screenSize=ScreenType.UNKNOWN;





    const isHighResolution = window.devicePixelRatio > 1;

    return new ScreenData(screenSize, orientation, isHighResolution, windowSize, isFullScreen);
};

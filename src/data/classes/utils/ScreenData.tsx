import {ScreenType} from "../../enums/ScreenType";

export default class ScreenData {
    type: ScreenType;
    orientation: String;
    isHighResolution: boolean;
    windowSize: {
        width: number;
        height: number
    };
    isFullScreen: boolean;

    constructor(type: ScreenType, orientation: String, isHighResolution: boolean,
                windowSize: { width: number; height: number }, isFullScreen: boolean) {
        this.type = type;
        this.orientation = orientation;
        this.isHighResolution = isHighResolution;
        this.windowSize = windowSize;
        this.isFullScreen = isFullScreen;
    }

    public getDesignNumber(): number {
        if (this.isFullScreen)
            switch (this.type) {
                case ScreenType.DESKTOP:
                case ScreenType.BIG_SCREEN:
                    return this.isVertical() ? 4 : 5;
                case ScreenType.TABLET:
                case ScreenType.LAPTOP:
                    return this.isVertical() ? 2 : 3;
                case ScreenType.UNKNOWN:
                case ScreenType.MOBILE:
                default:
                    return this.isVertical() ? 0 : 1;
            }
        let retVal= 0;
        if (this.windowSize.height<= this.windowSize.width) retVal +=1;
        if(Math.max(this.windowSize.height,this.windowSize.width)>=768)retVal +=2;
        if(Math.max(this.windowSize.height,this.windowSize.width)>=1200) retVal +=2;
        return retVal;

    }

    public isVertical(): boolean {
        // return this.isFullScreen?this.orientation.toLowerCase().includes("vertical"):this.windowSize.height>this.windowSize.width;
        if(!this.windowSize)return false;
        return this.windowSize.height>this.windowSize.width;
    }

    public isHorizontal(): boolean {
        // return this.isFullScreen?this.orientation.toLowerCase().includes("horizontal"):this.windowSize.height<this.windowSize.width;
        return this.windowSize.height<this.windowSize.width;
    }
}
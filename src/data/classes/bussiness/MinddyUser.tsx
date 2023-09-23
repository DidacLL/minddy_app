import MinddyService from "../../minddy.service";
import {MinddyObject} from "./MinddyObject";
import {Favourite} from "../Favourite";

export class UserConfig {
    favourites: Favourite[];
    language:string;
    theme:string;

    constructor(favourites: Favourite[], language: string, theme: string) {
        this.favourites = favourites;
        this.language = language;
        this.theme = theme;
    }
}

export class MinddyUser extends MinddyObject{
    token:string;
    userName!:string;
    userConfig!:UserConfig;
    constructor(token: string) {
        super();
        this.token = token;
        MinddyService.loadUserData(token,
            ({userName, uiConfig}) => {
                this.userName = userName;
                this.userConfig = uiConfig
            })
            .then(()=>this.isLoaded=true)
    }
}
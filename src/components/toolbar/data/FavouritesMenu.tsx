import {Link} from "react-router-dom";
import {Trans} from "@lingui/macro";
import React from "react";
import {MinddyManager} from "../../../data/Minddy.manager";


export function FavouritesMenu(prop: { manager: MinddyManager }) {
    return <ul className="p-2">
        {
            prop.manager.user.userConfig.favourites?.map((el) => {
                return <li><Link to={"/new/project"} className="dropdown-item justify-between ">
                    <label> {el.title}</label>
                    {el.icon}
                </Link></li>
            })
        }
        <li><Link to={"/new/project"} className="dropdown-item justify-between menu-title">
            <label className=""><Trans>edit Favourites</Trans></label>
        </Link></li>
    </ul>;
}
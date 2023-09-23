import {Link} from "react-router-dom";
import {Trans} from "@lingui/macro";
import {ArchiveBoxIcon, BoltIcon, DocumentTextIcon} from "@heroicons/react/20/solid";
import React from "react";

export function NewMenu() {
    return <div className="">
        <div
            className="flex flex-nowrap tooltip tooltip-right font-extralight lowercase bg-primary hover:bg-secondary px-2 mt-2 rounded-r-box justify-between"
            data-tip={"create Project"}>
            <ArchiveBoxIcon className="h-[1.5em] mr-4"/>
            <Link to={"/new/project"} className="dropdown-item justify-between text-primary-content ">
                <label className="font-bold "><Trans>Project</Trans></label>
            </Link>
        </div>
        <div
            className="flex flex-nowrap   tooltip tooltip-right font-extralight lowercase bg-primary hover:bg-secondary px-2 mt-2 rounded-r-box justify-between"
            data-tip={"create Task"}>
            <BoltIcon className="h-[1.5em] mr-4"/>
            <Link to={"/new/task"} className="dropdown-item justify-between text-primary-content">
                <label className="font-bold "><Trans>Task</Trans></label>
            </Link>
        </div>
        <div
            className="flex flex-nowrap   tooltip tooltip-right font-extralight lowercase bg-primary hover:bg-secondary px-2 mt-2 rounded-r-box justify-between"
            data-tip={"create Note"}>
            <DocumentTextIcon className="h-[1.5em] mr-4 "/>
            <Link to={"/new/note"}
                  className="dropdown-item text-primary-content hover:bg-transparent flex justify-between">
                <label className="font-bold  "><Trans>Note</Trans></label>
            </Link>
        </div>
    </div>;
}
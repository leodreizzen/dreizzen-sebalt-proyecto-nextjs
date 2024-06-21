import {BsArrowBarLeft, BsArrowBarRight} from "react-icons/bs";
import React from "react";

export default function SidebarCollapseButton({collapsed, onCollapsedChange}: { collapsed: boolean, onCollapsedChange: (collapsed: boolean) => void }) {
    return (
        <div className={"flex flex-row w-full h-12"}>
            <button className="text-white h-10 border-2 p-2 m-2 bg-navbar-bg"
                    onClick={() => onCollapsedChange(!collapsed)}>
                {collapsed ? <BsArrowBarRight/> : <BsArrowBarLeft/>}
            </button>
        </div>
    )
}
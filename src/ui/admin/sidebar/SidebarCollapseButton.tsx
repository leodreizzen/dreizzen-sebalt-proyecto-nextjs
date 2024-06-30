import {BsArrowBarLeft, BsArrowBarRight} from "react-icons/bs";
import React from "react";
import clsx from "clsx";

export default function SidebarCollapseButton({collapsed, onCollapsedChange, className}: { className?: string, collapsed: boolean, onCollapsedChange: (collapsed: boolean) => void }) {
    return (
        <div className={clsx("flex flex-row w-full h-12", className)}>
            <button className="text-white h-10 border-2 p-2 m-2 bg-navbar-bg"
                    onClick={() => onCollapsedChange(!collapsed)}>
                {collapsed ? <BsArrowBarRight/> : <BsArrowBarLeft/>}
            </button>
        </div>
    )
}
"use client"
import AdminSidebar from "@/ui/admin/sidebar/AdminSidebar";
import React, {Suspense, useEffect, useState} from "react";
import SidebarCollapseButton from "@/ui/admin/sidebar/SidebarCollapseButton";
import {useWindowSize} from "@uidotdev/usehooks";
import resolveConfig from 'tailwindcss/resolveConfig';
import taiwindConfig from '@/../tailwind.config';
import clsx from "clsx";
const tailwindConfig = resolveConfig(taiwindConfig)



export default function AdminLayout({children}: { children: React.ReactNode }) {
    const {width} = useWindowSize()
    const [collapsed, setCollapsed] = useState(true)
    const [sidebarInitialized, setSidebarInitialized] = useState(false)

    useEffect(()=>{
        if(width && !sidebarInitialized){
            setCollapsed(width <= Number(tailwindConfig.theme.screens.sm.replace('px', '')))
            setSidebarInitialized(true)
        }
    }, [sidebarInitialized, width])

    const fullScreenNavbar = width != null && width <= Number(tailwindConfig.theme.screens.sm.replace('px', ''));

    return (
        <div className="flex w-screen min-h-dvh bg-background">
            <AdminSidebar collapsed={collapsed} initialized={sidebarInitialized} fullScreen={fullScreenNavbar} onCollapsedChange={setCollapsed}/>
            <div className={clsx("flex flex-col h-full flex-grow overflow-auto", fullScreenNavbar && !collapsed && "hidden")}>
                <SidebarCollapseButton collapsed={collapsed} onCollapsedChange={setCollapsed}/>
                <div className={clsx("flex-grow w-full px-6 bg-background overflow-auto", fullScreenNavbar && !collapsed && "hidden")}>
                    <Suspense fallback={<div/>}>
                        {children}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
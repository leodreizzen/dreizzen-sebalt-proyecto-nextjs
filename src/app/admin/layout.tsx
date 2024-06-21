"use client"
import AdminSidebar from "@/ui/admin/sidebar/AdminSidebar";
import React, {Suspense, useEffect, useState} from "react";
import SidebarCollapseButton from "@/ui/admin/sidebar/SidebarCollapseButton";
import {useWindowSize} from "@uidotdev/usehooks";
import resolveConfig from 'tailwindcss/resolveConfig';
import taiwindConfig from '@/../tailwind.config';
const tailwindConfig = resolveConfig(taiwindConfig)



export default function AdminLayout({children}: { children: React.ReactNode }) {
    const {width} = useWindowSize()
    const [collapsed, setCollapsed] = useState(true)
    const [sidebarInitialized, setSidebarInitialized] = useState(false)

    useEffect(()=>{
        if(width){
            setCollapsed(width <= Number(tailwindConfig.theme.screens.sm.replace('px', '')))
            setSidebarInitialized(true)
        }
    }, [width])


    return (
        <div className="flex h-screen w-screen bg-background">
            <AdminSidebar collapsed={collapsed} initialized={sidebarInitialized}/>
            <div className="flex flex-col h-full flex-grow overflow-auto">
                <SidebarCollapseButton collapsed={collapsed} onCollapsedChange={setCollapsed}/>
                <div className="flex-grow w-full p-6 bg-background overflow-auto">
                    <Suspense fallback={<div/>}>
                        {children}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
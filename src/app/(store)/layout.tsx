import React, {Suspense} from "react";
import Navbar from "@/ui/Navbar";

export default function StoreLayout({children}: { children: React.ReactNode} ) {
    return (
        <Suspense fallback={<div className="bg-navbar-bg h-16 w-full"/>}>
            <Navbar className="w-full"/>
            <div className="w-full flex-grow overflow-auto">
                {children}
            </div>
        </Suspense>
    )
}
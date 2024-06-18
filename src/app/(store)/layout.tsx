import React from "react";
import Navbar from "@/ui/navbar/NavbarWrapper";
import {ShoppingCartProvider} from "@/context/ShoppingCartContext";

export default function StoreLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="w-full flex flex-col h-full">
            <ShoppingCartProvider>
                <Navbar className="w-full"/>
                <div className="w-full flex-grow overflow-auto">
                    {children}
                </div>
            </ShoppingCartProvider>

        </div>
    )
}
import React from "react";
import Navbar from "@/ui/navbar/NavbarWrapper";
import {ShoppingCartProvider} from "@/context/ShoppingCartContext";
import {Footer} from "@/ui/footer";

export default function StoreLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="w-full flex flex-col flex-grow h-full">
            <ShoppingCartProvider>
                <Navbar className="w-full"/>
                <div className="w-full flex-grow overflow-auto flex flex-col">
                    {children}
                </div>
                <Footer/>
            </ShoppingCartProvider>
        </div>
    )
}
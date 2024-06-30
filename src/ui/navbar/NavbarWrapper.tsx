import {fetchDropdownTags} from "@/lib/data";
import React from "react";
import Navbar from "@/ui/navbar/Navbar";

export default async function NavbarWrapper({ className }: { className?: string }){
    const dropdownTags = await fetchDropdownTags()
    return <Navbar className={className} dropdownTags={dropdownTags} />
}


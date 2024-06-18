"use client";

import React, {useState} from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';
import { FaStar, FaShoppingBag, FaTag, FaDollarSign } from 'react-icons/fa';
import { ShoppingCartBoldIcon } from "@nextui-org/shared-icons";
import {Link as NextUILink} from "@nextui-org/link";
import Link from "next/link";
import clsx from "clsx";
import {usePathname, useSearchParams} from "next/navigation";
import VaporLogo from "@/ui/icons/VaporLogo";

type NormalMenuItem = {
    name: string;
    pathname: string;
    icon: React.ReactNode;
    type: "normal";
}

type SubMenuItem = {
    name: string;
    baseUrl: string;
    children: SubMenuChildItem[];
    icon: React.ReactNode;
    type: "submenu";
}

type SubMenuChildItem = {
    name: string;
    extraURL?: string;
    icon?: React.ReactNode;
}

type MenuItem = NormalMenuItem | SubMenuItem;

export default function AdminSidebar(){
    const currentPathName = usePathname()

    const [collapsed, setCollapsed] = useState(true);

    const mainMenuItems : MenuItem[] = [
        {
            name: "Featured",
            type: "submenu",
            baseUrl: "/admin/featured",
            icon: <FaStar />,
            children: [
                {
                    name: "Products",
                    extraURL: "/products",
                },
                {
                    name: "Tags",
                    extraURL: "/tags",
                },
                {
                    name: "Sales",
                    extraURL: "/sales",
                }
            ]
        },
        {
            name: "Products",
            pathname: "/admin/products",
            icon: <FaShoppingBag />,
            type: "normal",
        },
        {
            name: "Purchases",
            pathname: "/admin/purchases",
            icon: <ShoppingCartBoldIcon />,
            type: "normal",
        },
        {
            name: "Tags",
            pathname: "/admin/tags",
            icon: <FaTag />,
            type: "normal",
        }
    ]

    return (
        <>
            <div className="flex flex-col h-full">
                <Sidebar backgroundColor={'black'} collapsed={collapsed} collapsedWidth={'80px'}
                         className={clsx(collapsed && "max-sm:hidden", "h-full")}>
                    <Menu
                        menuItemStyles={
                            {
                                button: ({active}) => {
                                    return {
                                        backgroundColor: active ? 'white' : 'black',
                                        color: active ? 'black' : 'white',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color: 'black',
                                        },
                                    };
                                }
                            }
                        }
                    >
                        <div className={"flex flex-row items-center mt-3 mb-3 justify-center"}>
                            <VaporLogo className={"fill-white mr-1"} cropped={collapsed}/>
                        </div>
                        <hr className="border-borders my-2"/>
                        {mainMenuItems.map((item) => (
                            item.type === "normal" ?
                                <MenuItem key={item.name} icon={item.icon} active={isSelected(item, currentPathName)}>
                                    {item.name}
                                </MenuItem>
                                :
                                <SubMenu key={item.name} title={item.name} icon={item.icon} label={item.name}>
                                    {item.children.map((child) => (
                                        <MenuItem key={child.name} icon={<FaStar/>}
                                                  active={isSelected(item, currentPathName)}>
                                            {child.name}
                                        </MenuItem>
                                    ))}
                                </SubMenu>
                        ))}
                    </Menu>
                </Sidebar>
            </div>
            <button className="text-white h-10 border-2 p-2 m-2 bg-navbar-bg" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <BsArrowBarRight/> : <BsArrowBarLeft/>}
            </button>
        </>
            )
            }

            function concatURL(base: string, extra: string | undefined) {
            return base + (extra ? `/${extra}` : "")
        }

            function isSelected(item: MenuItem, currentPathName: string) {

            if (item.type === "normal") {
            return item.pathname === currentPathName
        }
            else {
            for (const child of item.children) {
            if (currentPathName === concatURL(item.baseUrl, child.extraURL))
            return true
        }
            return false

        }
        }
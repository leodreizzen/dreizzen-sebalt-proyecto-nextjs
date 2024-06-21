"use client";

import React, {ReactNode} from "react";
import {Sidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';
import {FaStar, FaGamepad, FaTag} from 'react-icons/fa';
import {ShoppingCartBoldIcon} from "@nextui-org/shared-icons";
import Link from "next/link";
import clsx from "clsx";
import {usePathname} from "next/navigation";
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

export default function AdminSidebar({ collapsed, className, initialized } : { collapsed: boolean, className?: string, initialized:boolean }) {
    const currentPathName = usePathname()

    const mainMenuItems: MenuItem[] = [
        {
            name: "Featured",
            pathname: "/admin/featured",
            icon: <FaStar/>,
            type: "normal",
        },
        {
            name: "Products",
            pathname: "/admin/products",
            icon: <FaGamepad/>,
            type: "normal",
        },
        {
            name: "Purchases",
            pathname: "/admin/purchases",
            icon: <ShoppingCartBoldIcon/>,
            type: "normal",
        },
        {
            name: "Tags",
            pathname: "/admin/tags",
            icon: <FaTag/>,
            type: "normal",
        }
    ]

    return initialized ? (
        <Sidebar backgroundColor={'black'} collapsed={collapsed} collapsedWidth={'80px'} width={"320px"}
                 className={clsx(className, collapsed && "max-sm:hidden", "h-full")}>
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
                    <VaporLogo className={"fill-white mr-1"} cropped={collapsed} h={"80px"} w={"140px"}/>
                </div>
                <hr className="border-borders my-2"/>
                {mainMenuItems.map((item) => (
                    item.type === "normal" ?
                        <SidebarMenuComponent item={item} selected={isSelected(item, currentPathName)}
                                              key={item.name}/>
                        :
                        <SidebarSubMenuComponent item={item} selected={isSelected(item, currentPathName)}
                                                 parentUrl={item.baseUrl} key={item.name}/>
                ))}
            </Menu>
        </Sidebar>
    ) : <div className="inline-block max-sm:hidden w-[320px] min-w-[320px] bg-navbar-bg border-r border-[#efefef]"/>
}

function SidebarMenuComponent({item, selected}: { item: NormalMenuItem, selected: boolean }): ReactNode {
    return (
        <Link className={clsx("", {"text-primary": selected, "text-foreground": !selected})}
              href={item.pathname}>
            <MenuItem key={item.name} icon={item.icon} active={selected} component={'div'}>
                {item.name}
            </MenuItem>
        </Link>
    )
}

function SidebarSubMenuComponent({item, selected}: {
    item: SubMenuItem,
    selected: boolean,
    parentUrl: string
}): ReactNode {
    return (
        <SubMenu key={item.name} title={item.name} icon={item.icon} label={item.name}>
            {item.children.map((child) => (
                <MenuItem key={child.name} icon={<FaStar/>}
                          active={selected}>
                    <SidebarSubMenuItemComponent item={child}
                                                 selected={selected}
                                                 parentUrl={item.baseUrl}/>
                </MenuItem>
            ))}
        </SubMenu>
    )
}

function SidebarSubMenuItemComponent({item, selected, parentUrl}: {
    item: SubMenuChildItem,
    selected: boolean,
    parentUrl: string
}): ReactNode {
    return (
        <Link href={concatURL(parentUrl, item.extraURL)}
              className={clsx("", {"text-primary": selected, "text-foreground": !selected})}>
            <MenuItem key={item.name} icon={item.icon} active={selected} component={'div'}>
                {item.name}
            </MenuItem>
        </Link>
    )
}

function concatURL(base: string, extra: string | undefined) {
    return base + (extra ? `/${extra}` : "")
}

function isSelected(item: MenuItem, currentPathName: string) {
    if (item.type === "normal") {
        return item.pathname === currentPathName
    } else {
        for (const child of item.children) {
            if (currentPathName === concatURL(item.baseUrl, child.extraURL))
                return true
        }
        return false
    }
}
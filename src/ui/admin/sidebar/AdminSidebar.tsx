"use client";

import React, {ReactNode} from "react";
import {Sidebar, Menu, MenuItem, SubMenu, sidebarClasses} from 'react-pro-sidebar';
import {FaStar, FaGamepad, FaTag, FaDollarSign} from 'react-icons/fa';
import {ShoppingCartBoldIcon} from "@nextui-org/shared-icons";
import Link from "next/link";
import clsx from "clsx";
import {usePathname} from "next/navigation";
import VaporLogo from "@/ui/icons/VaporLogo";
import {manageLogout} from "@/ui/admin/sidebar/logout";
import {LogOutIcon} from "lucide-react";

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
    type: "child";
    extraURL?: string;
    icon?: React.ReactNode;
}

type MenuItem = NormalMenuItem | SubMenuItem | SubMenuChildItem;

export default function AdminSidebar({collapsed, className, initialized}: {
    collapsed: boolean,
    className?: string,
    initialized: boolean
}) {
    const currentPathName = usePathname()


    const handleLogout = async () => {
        await manageLogout()
    }

    const mainMenuItems: MenuItem[] = [
        {
            name: "Featured",
            icon: <FaStar/>,
            type: "submenu",
            baseUrl: "/admin/featured",
            children: [
                {
                    name: "Products",
                    extraURL: "products",
                    type: "child",
                    icon: <FaGamepad/>
                },
                {
                    name: "Tags",
                    extraURL: "tags",
                    type: "child",
                    icon: <FaTag/>
                },
                {
                    name: "Sales",
                    extraURL: "sales",
                    type: "child",
                    icon: <FaDollarSign/>
                }
            ]
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
                 className={clsx(className, collapsed && "max-sm:hidden", "h-full")}
                 rootStyles={{
                     height: '-webkit-fill-available',
                     [`.${sidebarClasses.container}`]: {
                         display: 'flex',
                         flexDirection: 'column',
                         justifyContent: 'space-between',
                     }
                 }}>
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
                        item.type === "submenu" ?
                        <SidebarSubMenuComponent item={item} key={item.name}/>
                            :
                            null
                ))}
            </Menu>
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
                <MenuItem icon={<LogOutIcon/>} active={false} onClick={handleLogout}>
                    Logout
                </MenuItem>
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

function SidebarSubMenuComponent({item}: {
    item: SubMenuItem,
}): ReactNode {
    return (
        <SubMenu key={item.name} title={item.name} icon={item.icon} label={item.name}>
            {item.children.map((child) => (
                <SidebarSubMenuItemComponent item={child}
                                             key = {child.name}
                                             parentUrl={item.baseUrl}/>
            ))}
        </SubMenu>
    )
}

function SidebarSubMenuItemComponent({item, parentUrl}: {
    item: SubMenuChildItem,
    parentUrl: string
}): ReactNode {
    const currentPathName = usePathname()
    return (
        <Link href={concatURL(parentUrl, item.extraURL)}>
            <MenuItem key={item.name} icon={item.icon} active={isSelected(item, currentPathName, parentUrl)} component={'div'}>
                {item.name}
            </MenuItem>
        </Link>
    )
}

function concatURL(base: string, extra: string | undefined) {
    return base + (extra ? `/${extra}` : "")
}

function isSelected(item: MenuItem, currentPathName: string, parentUrl?: string) {
    const parent = parentUrl ? parentUrl : ""
    if (item.type === "normal") {
        return item.pathname === currentPathName
    } else {
        if (item.type==="submenu" && item.baseUrl === currentPathName)
            for (const child of item.children) {
                if (currentPathName === concatURL(item.baseUrl, child.extraURL))
                    return true
            }
        else {
            return item.type === "child" && currentPathName === concatURL(parent, item.extraURL);
        }
        return false
    }
}
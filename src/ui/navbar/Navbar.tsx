"use client"
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/navbar";
import { Link as NextUILink } from "@nextui-org/link";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import React, { ReactNode, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/dropdown";
import clsx from "clsx";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {Tag} from "@prisma/client";
import ShoppingCartButton from "@/ui/navbar/ShoppingCartButton";
import WebLogo from "@/ui/icons/WebLogo";

type NormalMenuItem = {
  name: string;
  pathname: string;
  type: "normal";
}

type DropdownMenuItem = {
  name: string;
  baseUrl: string;
  children: ChildItem[];
  type: "dropdown";
}

type ChildItem = {
  name: string;
  extraURL?: string;
}

type MenuItem = NormalMenuItem | DropdownMenuItem;

export default function Navbar({ className, dropdownTags }: { className?: string, dropdownTags: Tag[] }) {
  const currentPathName = usePathname()
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const genreLinks = dropdownTags.map(tag => ({
    name: tag.name,
    extraURL: tag.id.toString(),
  }))

  const menuItems: MenuItem[] = [
    {
      name: "Home",
      type: "normal",
      pathname: "/",
    },
    {
      name: "Tags",
      type: "dropdown",
      baseUrl: "/products/featured/tag",
      children: genreLinks
    },
    { name: "Top sellers", type: "normal", pathname: "/products/topsellers" },
    { name: "Sales", type: "normal", pathname: "/products/discounts" },
  ]

  return (
    <NextUINavbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      maxWidth={"full"}
      className={clsx("bg-navbar-bg h-16 border-b-1 border-navbar-border", className)}
      classNames={{wrapper: "max-lg:px-3 lg: px-4 xl:px-6 2xl:px-8"}}
    >
      <NavbarContent justify="start" className={clsx(searchOpen && "max-md:!flex-grow-[0.5] max-lg:!flex-grow-[0.5]")}>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <NextUILink as={Link} href="/" aria-label="Go to home"><WebLogo className={"fill-white mr-1"} h={"51.2px"} w={"110px"}/></NextUILink>
        </NavbarBrand>

      </NavbarContent>

      <NavbarContent className={clsx("hidden sm:flex !gap-0  md:!gap-8 lg:!gap-10", searchOpen && "max-[800px]:!flex-grow-0 max-lg:!flex-grow-[0.5] sm:!gap-3" || "sm:!gap-6")} justify="center">
        {
          menuItems.map((item) => (
            <NavbarItem key={item.name}>
              <NavbarItemComponent item={item} selected={isSelected(item, currentPathName)} />
            </NavbarItem>
          ))
        }
      </NavbarContent>

      <NavbarContent justify="end" className="flex-shrink overflow-clip gap-2 md:gap-3 lg:gap-4">
        <NavbarItem className="flex-shrink overflow-clip">
          <SearchBar isOpen={searchOpen} onOpenChange={setSearchOpen} />
        </NavbarItem>
        <NavbarItem>
            <ShoppingCartButton/>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="w-full gap-4">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <NavbarMenuComponent item={item} selected={isSelected(item, currentPathName)} onItemClick={() => setIsMenuOpen(false)} />
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
}


function NavbarItemComponent({ item, selected }: { item: MenuItem, selected: boolean }): ReactNode {
  const router = useRouter()

  if (item.type === "normal") {
    return (
      <Link className={clsx({ "text-primary": selected, "text-foreground": !selected })} href={item.pathname}>
        {item.name}
      </Link>
    )
  }
  else return (
    <Dropdown>
      <DropdownTrigger>
        <Button className={clsx("p-0 bg-transparent text-medium min-w-0 select-text", { "text-primary": selected, "text-foreground": !selected })}>
          {item.name}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label={`Dropdown menu of ${item.name}`}>
        {
          item.children.map(child => (
            <DropdownItem key={child.name} textValue={child.name} variant="solid"
              onPress={() => router.push(
                concatURL(item.baseUrl,
                  child.extraURL)
              )}>
              {child.name}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
    </Dropdown>
  )
}

function NavbarMenuComponent({ item, selected, onItemClick }: { item: MenuItem, selected: boolean, onItemClick: () => void }): ReactNode {
  if (item.type === "normal") {
    return (
      <Link className={clsx("mr-3", { "text-primary": selected, "text-foreground": !selected })}
        href={item.pathname}
        onClick={() => onItemClick()}>
        {item.name}
      </Link>
    )
  }
  else return (
    <CollapsibleMenuItem item={item} selected={selected} onChildClick={() => onItemClick()} />
  )
}

function CollapsibleMenuItem({ item, onChildClick, selected }: { item: DropdownMenuItem, onChildClick?: (child: ChildItem) => void, selected: boolean }): ReactNode {
  const [isOpen, setIsOpen] = useState(false)
  function buttonPress() {
    setIsOpen(isOpen => !isOpen)
  }
  return (
    <div>
      <Button size="md" onPress={buttonPress} disableAnimation
        className={clsx("bg-transparent p-0 w-full text-start inline text-large h-[revert]", { "text-white": !selected, "text-primary": selected })}
      >
        {item.name}
      </Button>
      {
        isOpen && <div className="flex flex-col gap-3 mt-2">
          {
            item.children.map((child, index) => (
              <Link href={
                concatURL(item.baseUrl,
                  child.extraURL)
              }
                color="foreground"
                className={clsx("ml-4 text-sm", { "mt-2": index !== 0, "mt-1": index == 0 })}
                key={child.name}
                onClick={() => onChildClick ? onChildClick(child) : undefined}
              >
                {child.name}
              </Link>
            ))}
        </div>
      }
    </div>
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
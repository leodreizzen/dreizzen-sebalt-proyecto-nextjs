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
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ShoppingCartButtonWrapper from "../ShopppingCartButtonWrapper";
import {Tag} from "@prisma/client";

type NormalMenuItem = {
  name: string;
  pathname: string;
  searchParams?: { [key: string]: string };
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
  searchParams?: { [key: string]: string };
}

type MenuItem = NormalMenuItem | DropdownMenuItem;

export default function Navbar({ className, dropdownTags }: { className?: string, dropdownTags: Tag[] }) {
  const currentPathName = usePathname()
  const currentParams = useSearchParams()
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const genreLinks = dropdownTags.map(tag => ({
    name: tag.name,
    extraURL: tag.id.toString(),
  }))

  const menuItems: MenuItem[] = [
    {
      name: "Inicio",
      type: "normal",
      pathname: "/",
    },
    {
      name: "Géneros",
      type: "dropdown",
      baseUrl: "/products/featured/tag",
      children: genreLinks
    },
    { name: "Más vendidos", type: "normal", pathname: "/products/topsellers" },
    { name: "Ofertas", type: "normal", pathname: "/products/discounts" },
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
          aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <NextUILink as={Link} href="/" aria-label="Ir a home"><div className="h-10 w-10 bg-red-100 mr-2" /></NextUILink>
          <NextUILink as={Link} className={clsx("font-bold text-foreground", searchOpen && "max-[400px]:hidden flex-shrink")} href="/">Vapor</NextUILink>
        </NavbarBrand>

      </NavbarContent>

      <NavbarContent className={clsx("hidden sm:flex !gap-0  md:!gap-8 lg:!gap-10", searchOpen && "max-[800px]:!flex-grow-0 max-lg:!flex-grow-[0.5] sm:!gap-3" || "sm:!gap-6")} justify="center">
        {
          menuItems.map((item) => (
            <NavbarItem key={item.name}>
              <NavbarItemComponent item={item} selected={isSelected(item, currentPathName, currentParams)} />
            </NavbarItem>
          ))
        }
      </NavbarContent>

      <NavbarContent justify="end" className="flex-shrink overflow-clip gap-2 md:gap-3 lg:gap-4">
        <NavbarItem className="flex-shrink overflow-clip">
          <SearchBar isOpen={searchOpen} onOpenChange={setSearchOpen} />
        </NavbarItem>
        <NavbarItem>
            <ShoppingCartButtonWrapper />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="w-full gap-4">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <NavbarMenuComponent item={item} selected={isSelected(item, currentPathName, currentParams)} onItemClick={() => setIsMenuOpen(false)} />
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
}


function NavbarItemComponent({ item, selected }: { item: MenuItem, selected: boolean }): ReactNode {
  const router = useRouter()

  function route({ pathname, query }: { pathname: string, query: { [_: string]: string } | undefined }) {
    if (!query || Object.keys(query).length === 0)
      router.push(pathname)
    else {
      const params = new URLSearchParams(query)
      router.push(`${pathname}&${params.toString()}`)
    }
  }

  if (item.type === "normal") {
    return (
      <Link className={clsx({ "text-primary": selected, "text-foreground": !selected })} href={{ pathname: item.pathname, query: item.searchParams }}>
        {item.name}
      </Link>
    )
  }
  else return (
    <Dropdown>
      <DropdownTrigger>
        <Button className={clsx("p-0 bg-transparent text-medium min-w-0", { "text-primary": selected, "text-foreground": !selected })}>
          {item.name}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label={`Menú desplegable de ${item.name}`}>
        {
          item.children.map(child => (
            <DropdownItem key={child.name} textValue={child.name} variant="solid"
              onPress={() => route({
                pathname: concatURL(item.baseUrl,
                  child.extraURL),
                query: child.searchParams
              })}>
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
        href={{ pathname: item.pathname, query: item.searchParams }}
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
              <Link href={{
                pathname: concatURL(item.baseUrl,
                  child.extraURL),
                query: child.searchParams
              }}
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

function isSelected(item: MenuItem, currentPathName: string, currentParams: URLSearchParams) {
  function containsParams(params: { [key: string]: string }, currentParams: URLSearchParams) {
    return Object.keys(params).every(key => currentParams.get(key) === params[key])
  }

  if (item.type === "normal") {
    return item.pathname === currentPathName && containsParams(item.searchParams || {}, currentParams)
  }
  else {
    for (const child of item.children) {
      if (currentPathName === concatURL(item.baseUrl, child.extraURL) && containsParams(child.searchParams || {}, currentParams))
        return true
    }
    return false

  }
}
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
import ShoppingCartButton from "./ShoppingCartButton";
import { useRouter } from "next/navigation";

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

export default function Navbar({ className }: { className?: string }) {
  const currentPathName = usePathname()
  const currentParams = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      children: [
        { name: "Acción", extraURL: "1" },
        { name: "Aventura", extraURL: "2" },
        { name: "Deportes", extraURL: "3" },
        { name: "Estrategia", extraURL: "4" },
        { name: "Rol", extraURL: "5" },
        { name: "Simulación", extraURL: "6" },
      ]
    },
    { name: "Más vendidos", type: "normal", pathname: "/products/topsellers" },
    { name: "Ofertas", type: "normal", pathname: "/products/discounts" },
  ]

  return (
    <NextUINavbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} className={clsx("bg-navbar-bg w-16", className)}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <NextUILink as={Link} href="/"><div className="h-10 w-10 bg-red-100 mr-2" /></NextUILink>
          <NextUILink as={Link} className="font-bold text-foreground" href="/">Vapor</NextUILink>
        </NavbarBrand>

      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {
          menuItems.map((item) => (
            <NavbarItem key={item.name}>
              <NavbarItemComponent item={item} selected={isSelected(item, currentPathName, currentParams)} />
            </NavbarItem>
          ))
        }
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <SearchBar />
        </NavbarItem>
        <NavbarItem>
          <ShoppingCartButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="w-full">
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
      <Link className={clsx("mr-3", { "text-primary": selected, "text-foreground": !selected })} href={{ pathname: item.pathname, query: item.searchParams }}>
        {item.name}
      </Link>
    )
  }
  else return (
    <Dropdown>
      <DropdownTrigger>
        <Button className={clsx("mr-3 bg-transparen text-medium", { "text-primary": selected, "text-foreground": !selected })}>
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
        isOpen && <div className="flex flex-col">
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
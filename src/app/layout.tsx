import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import clsx from "clsx";
import { NextUIProvider } from "@nextui-org/system";
import Navbar from "@/ui/Navbar";
import { Suspense } from "react";
import ShoppingCartContextWrapper from "@/context/ShoppingCartContextWrapper";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vapor",
  description: "Generated by create next app", //TODO CAMBIAR
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, "min-h-screen min-w-screen bg-background flex flex-col text-foreground")}>
        <ShoppingCartContextWrapper>
          <NextUIProvider className="min-h-screen flex flex-col">
            <Suspense fallback={<div className="bg-navbar-bg h-16 w-full" />}>
              <Navbar className="w-full" />
            </Suspense>
            <div className="w-full flex-grow overflow-auto">
              {children}
            </div>
          </NextUIProvider>
        </ShoppingCartContextWrapper>
      </body>
    </html>
  );
}

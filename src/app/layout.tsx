import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import clsx from "clsx";
import { NextUIProvider } from "@nextui-org/system";
import {Toaster} from "@/ui/shadcn/toaster";
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
          <NextUIProvider className="min-h-screen flex flex-col">
            {children}
          </NextUIProvider>
          <Toaster/>
      </body>
    </html>
  );
}

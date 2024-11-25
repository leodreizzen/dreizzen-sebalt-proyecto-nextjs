import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "@/app/globals.css";
import clsx from "clsx";
import {NextUIProvider} from "@nextui-org/system";
import {Toaster} from "@/ui/shadcn/toaster";
import {WEB_NAME} from "@/constants";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        template: `%s | ${WEB_NAME}`,
        default: WEB_NAME
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, "min-h-dvh min-w-screen bg-background flex flex-col text-foreground")}>
          <NextUIProvider className="min-h-dvh flex flex-col">
            {children}
        </NextUIProvider>
        <Toaster/>
        </body>
        </html>
    );
}

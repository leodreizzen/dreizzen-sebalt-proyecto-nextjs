import {Button} from "@nextui-org/button";
import React, {ReactNode} from "react";
import {FaDollarSign, FaGamepad, FaStar, FaTag} from "react-icons/fa";
import {ShoppingCartBoldIcon} from "@nextui-org/shared-icons";
import Link from "next/link";

export default async function AdminPage() {

    type MenuButton = {
        text: string,
        icon: ReactNode,
        href: string
    };


    const featuredButtons: MenuButton[] = [
        {
            text: "Featured products",
            icon: <FaGamepad/>,
            href: "/admin/featured/products"
        }, {
            text: "Featured tags",
            icon: <FaTag/>,
            href: "/admin/featured/tags"
        }, {
            text: "Featured sales",
            icon: <FaDollarSign/>,
            href: "/admin/featured/sales"
        }
    ]

    const buttons: MenuButton[] = [
        {
            text: "Products",
            icon: <FaGamepad/>,
            href: "/admin/products"
        }, {
            text: "Purchases",
            icon: <ShoppingCartBoldIcon/>,
            href: "/admin/purchases"
        }, {
            text: "Tags",
            icon: <FaTag/>,
            href: "/admin/tags"
        }
    ]
    return (
        <main>
            <div className="flex flex-col items-center w-fit mx-auto">
                <h1 className="text-xl mb-4">Admin panel</h1>
                <div className="flex max-lg:flex-col gap-x-10 gap-y-6">
                    <div className="border border-borders rounded-xl p-5 flex flex-col items-center gap-y-4">
                        <div className="flex items-center gap-x-1">
                            <FaStar className="text-large"/>
                            <h2> Featured </h2>
                        </div>

                        <div className="flex flex-col gap-y-5">
                            {featuredButtons.map((button, index) => (
                                <Button as={Link} href={button.href} key={index} className="flex justify-start text-large !p-6">
                                    {button.icon}{button.text}
                                </Button>
                            ))
                            }
                        </div>
                    </div>
                    <div className="border border-borders rounded-xl p-5 flex flex-col items-center gap-y-4">
                        <h2> Store management </h2>
                        <div className="flex flex-col gap-y-5 w-full">
                            {
                                buttons.map((button, index) => (
                                    <Button as={Link} href={button.href} key={index} className="flex justify-start text-large !p-6">
                                        <div className="flex"></div>
                                        {button.icon}{button.text}
                                    </Button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
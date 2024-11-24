import {FaSadCry} from "react-icons/fa";
import {Button} from "@nextui-org/button";
import Link from "next/link";

export default function Custom404() {
    return <div className={"flex flex-col flex-grow items-center justify-center"}>
        <div className="flex flex-col">
            <FaSadCry className={"w-[200px] h-[200px]"}/>
            <h1 className="text-lg mt-2">404 - Page Not Found</h1>
            <Button className="mt-3" as={Link} href={"/"}>Home</Button>
        </div>
    </div>
}
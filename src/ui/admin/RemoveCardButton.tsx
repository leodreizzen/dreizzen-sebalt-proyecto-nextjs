import {FaX} from "react-icons/fa6";
import clsx from "clsx";
import {PressEvent} from "react-aria";
import {Button} from "@nextui-org/button";

export default function RemoveCardButton({className, onPress}: { className?: string, onPress: (e: PressEvent) => void}) {
    return (
            <Button className={clsx(className,"bg-red-600 text-foreground p-2 min-w-0 min-h-0 !h-[revert] aspect-square rounded-full border-2 border-gray-800")} onPress={onPress}>
                <FaX className="size-full"/>
            </Button>
    )
}
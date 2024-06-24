import clsx from "clsx";
import {Card, CardHeader} from "@nextui-org/card";
import Image from "next/image";
import {FaX} from "react-icons/fa6";
import RemoveCardButton from "@/ui/admin/RemoveCardButton";

export default function ImageUploadCard({imageUrl, className, onClose} : {imageUrl: string; className?: string, onClose: () => void}) {

    const onPress = () => {
        console.log("Pressed");
    }

    const isPressable = true;

    return (
        <div className={"relative"}>
            <div className={"absolute top-0 right-1 z-10"}>
                <RemoveCardButton onPress={onClose}/>
            </div>
            <div className={clsx("gap-3 @container", className)}>
            <Card isFooterBlurred className={"w-full h-full"} onPress={onPress} isPressable={isPressable}>
                    <div className="gap-3 aspect-video h-full w-full">
                        <Image src={imageUrl} alt={"Image preview"} fill={true}/>
                    </div>
                </Card>
            </div>
        </div>
    )
}
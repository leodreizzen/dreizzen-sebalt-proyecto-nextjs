import { VideoDTO } from "@/data/DTO";
import { ReactNode } from "react";

export default function CloudinaryPlayer({video, className, autoPlay=false, active=true}: {video: VideoDTO, className?: string | undefined, autoPlay?: boolean, active?:boolean}): ReactNode{
    return(
        // TODO implementar
        <div className={className}>

        </div>
    )
}

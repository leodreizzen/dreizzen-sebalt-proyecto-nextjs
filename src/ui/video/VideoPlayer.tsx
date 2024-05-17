import { VideoDTO, VideoSource } from "@/data/DTO";
import { ReactNode } from "react";
import YouTubePlayer from "./YouTubePlayer";
import CloudinaryPlayer from "./CloudinaryPlayer";

export default function VideoPlayer({video, active=true, className}: {video: VideoDTO, active?:boolean, className?: string | undefined}): ReactNode{
    switch(video.source){
        case VideoSource.YOUTUBE:
            return <YouTubePlayer video={video} className={className} active={active}/>
        case VideoSource.CLOUDINARY:
            return <CloudinaryPlayer video={video} className={className} active={active}/>           
    }
}
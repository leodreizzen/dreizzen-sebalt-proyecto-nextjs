"use client"
import { VideoDTO, VideoSource } from "@/data/DTO";
import assert from "assert";
import { ReactNode, createRef, useEffect } from "react";

export default function YouTubePlayer({video, className, autoPlay=false, active=true}: {video: VideoDTO, className?: string | undefined, autoPlay?: boolean, active?:boolean}): ReactNode{
    assert(video.source === VideoSource.YOUTUBE, "Invalid video source")
    let url = video.url + "?";
    let ref = createRef<HTMLIFrameElement>();
    if (autoPlay)
        url = url + "autoplay=1&mute=1&" // mute to prevent autoplay from being blocked

    url += "showinfo=0&modestbranding=1&controls=2&rel=0&enablejsapi=1"
    
    if (!url.includes("youtube.com/embed/")){
        if(url.includes("youtube.com/watch?v="))
            url = url.replace("youtube.com/watch?v=", "youtube.com/embed/");
        else{
            url = ""
            console.error("Invalid YouTube URL")
        }
    }

    useEffect(() => {
        if (!active && ref.current){
            ref.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    }, [active, ref])

    return (
        <div className={className}>
            <iframe ref={ref} className="h-full w-full" src={url} allowFullScreen/>
        </div>
    );
}
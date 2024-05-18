"use client"
import { VideoSource } from "@/data/DTO";
import { VideoDTO } from "@/data/DTO";
import { ReactNode, useEffect, useRef, useState } from "react";
import getCloudinary from "../cloudinary";
import { AdvancedVideo } from "@cloudinary/react";
import assert from "assert";


export default function CloudinaryPlayer({ video, className, autoPlay = false, muted = false, active = true }: { video: VideoDTO, className?: string | undefined, autoPlay?: boolean, muted?: boolean, active?: boolean }): ReactNode {
    assert(video.source === VideoSource.CLOUDINARY, "Invalid video source")

    let ref = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!active && ref.current) {
          ref.current.contentWindow?.postMessage('pause', '*');
        }
      }, [active, ref]);

    // Cloudinary embed removes the extension (like .jpg) from the thumbnail url, so we duplicate it
    let thumbnailUrl = video.thumbnail.url;
    const extensionRegex = /\.[a-zA-Z0-9]+$/;
    if (extensionRegex.test(thumbnailUrl)) {
        thumbnailUrl += extensionRegex.exec(thumbnailUrl)?.[0] ?? ""
    }


    let params = `cloud_name=${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}&public_id=${video.sourceId}&controls=true&autoplay=${autoPlay}&muted=${muted}&poster=${thumbnailUrl}`

    const url = "https://player.cloudinary.com/embed/?" + params
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
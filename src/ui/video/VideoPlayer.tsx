"use client"
import { VideoDTO, VideoSource } from "@/lib/DTO";
import { ReactNode, useEffect, useState } from "react";
import getCloudinary from "../cloudinary";
import ReactPlayer from "react-player";

import clsx from "clsx";

export default function VideoPlayer({video, active=true, muted, autoplay, className}: {video: VideoDTO, active?:boolean, className?: string | undefined, muted?: boolean, autoplay?: boolean}): ReactNode{
    const [playing, setPlaying] = useState(false);
    let url
    switch(video.source){
        case VideoSource.YOUTUBE:
            url = `https://www.youtube.com/watch?v=${video.sourceId}`;
            break;
        case VideoSource.CLOUDINARY:
            url = getCloudinary().video(video.sourceId).toURL();
            break;
    }
    
    function handlePlay(){
        setPlaying(true);

        /*
            Necessary to patch a bug in react-player where setting playing=false just after it is started makes it not stop
            It isn`t enough to wait for the next render as react-player keeps a copy of playing as state.
        */
        setTimeout(() => {
            if (!active) {
                setPlaying(false);
            }
        }, 1);
    }

    function handlePreviewClick(){
        setPlaying(true);
    }

    function handlePause(){
        setPlaying(false);
    }

    useEffect(() => {
        if(!active)
            setPlaying(false);
    }, [active])


    return (
        <div className={clsx(className, playing && "no-swipe") }>
            <ReactPlayer url={url}
                width="100%"
                height="100%"
                playing={playing}
                controls={true} 
                onClickPreview={handlePreviewClick}
                onPlay={handlePlay}
                onPause={handlePause}
                light={video.thumbnail.url}
                config={
                    {
                        youtube: {
                            playerVars: {
                                controls: 2,
                                rel: 0,
                            }
                        },
                        file:{
                            attributes: {
                                controlsList: "nodownload noplaybackrate",
                                disablePictureInPicture: true
                            }
                        }
                    }
                }
            />                
        </div>
    )
}
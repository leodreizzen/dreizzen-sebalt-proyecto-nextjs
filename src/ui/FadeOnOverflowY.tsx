"use client"
import {useOverflow} from 'use-overflow'
import clsx from 'clsx'
import { useRef } from 'react'
export default function FadeOnOverflowY({children, className}: {children: React.ReactNode, className?: string}) {
    const ref = useRef<HTMLDivElement>(null)
    const {refYOverflowing, refYScrollBegin, refYScrollEnd} = useOverflow(ref)
    const style = refYOverflowing ? {mask: "linear-gradient(180deg, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0))"} : {}
    return(
        <div ref={ref} className={clsx(className, "HOLA")} style={style}>
            {children}
        </div>
    )

}
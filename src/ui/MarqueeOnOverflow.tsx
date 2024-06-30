"use client"
import clsx from 'clsx';
import {useMeasure } from '@uidotdev/usehooks';
interface MarqueeOverflowParams {
    className?: string;
    children: React.ReactNode;
    direction?: "horizontal" | "vertical";
    animation: [string, string];
}
export default function MarqueeOnOverflow({ className, children, direction = "horizontal", animation}: MarqueeOverflowParams) {
    const [ref1, size1] = useMeasure()
    const [ref2, size2] = useMeasure()

    const overflowX = size1.width && size2.width && size1.width < size2.width
    const overflowY = size1.height && size2.height && size1.height < size2.height
    const shouldAnimate = direction==="horizontal" ? overflowX : overflowY

    return (
        <div ref={ref1} className={clsx(className, 'relative flex', direction==="vertical" && "flex-col overflow-y-hidden" || "overflow-x-hidden")}>
            <div ref={ref2} className={clsx(shouldAnimate && animation[0])}>
                {children}
            </div>
            {shouldAnimate &&  <div className={clsx("absolute", animation[1], direction=="horizontal" && 'ml-1' || 'mt-1')}>
                {children}
            </div>}
        </div>
    )
}
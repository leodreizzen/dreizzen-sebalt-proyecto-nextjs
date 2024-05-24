import clsx from "clsx";
import { FaChevronRight } from "react-icons/fa";

export default function SwiperRightButton({ className, id, enabled }: { className?: string, enabled: boolean, id: string }) {
    return (<div id={id} className={clsx(className)}>
        <FaChevronRight className={clsx(
            "w-4 h-8 md:w-5 md:h-10 lg:w-6 lg:h-12 2xl:w-7 ml-1 text-white",
            {
                "cursor-pointer  active:text-slate-200": enabled,
                "opacity-30": !enabled
            }
        )} />
    </div>)
}

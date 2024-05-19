import clsx from "clsx";
import { FaChevronRight } from "react-icons/fa";

export default function SwiperRightButton({ className, id, enabled }: { className?: string, enabled: boolean, id: string }) {
    return (<div id={id} className={clsx(className)}>
        <FaChevronRight className={clsx(
            " w-8 h-16 p-1 text-white",
            {
                "cursor-pointer  active:text-slate-200": enabled,
                "opacity-30": !enabled
            }
        )} />
    </div>)
}

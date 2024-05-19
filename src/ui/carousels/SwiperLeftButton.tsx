import clsx from "clsx";
import { FaChevronLeft } from "react-icons/fa";

export default function SwiperLeftButton({ className, id, enabled }: { className?: string, enabled: boolean, id: string }) {
    return(<div id={id} className="mr-1">
        <FaChevronLeft className={clsx(
            " w-8 h-16 p-1 text-white",
            {
                "cursor-pointer  active:text-slate-200": enabled,
                "opacity-30": !enabled
            },
            className
            )} />
    </div>)
}

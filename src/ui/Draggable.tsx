import {forwardRef, ReactElement, ReactNode, Ref} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import clsx from "clsx";
import {UniqueIdentifier} from "@dnd-kit/core";

function AdminFeaturedProductCard({className, id, children}: { className?: string, children: ReactNode, id: UniqueIdentifier }, ref: Ref<HTMLDivElement> | undefined){
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: id});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div className={clsx(className)} ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    )
}

export default forwardRef(AdminFeaturedProductCard);
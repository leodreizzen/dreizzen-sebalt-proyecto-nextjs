import React, {ReactNode} from "react";
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import {IoMdAddCircle} from "react-icons/io";
import {DndContext, DragEndEvent, UniqueIdentifier} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import Draggable from "@/ui/Draggable";

export default function SortableList<T extends { id: UniqueIdentifier }>({
                                                                             items,
                                                                             onItemsOrderChange,
                                                                             className,
                                                                             children, draggablesClassname,
                                                                             onAddPress,
                                                                             maxCount
                                                                         }: {
    items: T[],
    onItemsOrderChange: (reorderItems: (items: T[]) => T[]) => void,
    className?: string,
    onAddPress: () => void,
    draggablesClassname?: string
    children: (item: T, index: number) => ReactNode
    maxCount?: number
}) {

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        if (!over) return;
        if (active.id !== over.id)
            onItemsOrderChange(reorderItems.bind(null, active, over))
    }

    function reorderItems(active: { id: UniqueIdentifier }, over: { id: UniqueIdentifier }, items: T[]) {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        if (oldIndex === undefined || newIndex === undefined) return items;

        return arrayMove(items, oldIndex, newIndex);
    }

    return (
        <div className={clsx(className)}>
            {(maxCount === undefined || items.length < maxCount) &&<Button onPress={onAddPress}
                    className={clsx("border border-borders rounded-2xl flex flex-col items-center justify-center bg-transparent [&>svg]:max-w-none", items.length === 0 ? "h-60 sm:h-44 2xl:h-64" : "!h-[revert]")}>
                <IoMdAddCircle className="h-1/2 w-1/2 text-foreground"/>
            </Button>}
            <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(p => ({...p, id: p.id}))}>
                    {items.map((item, index) => (
                        <Draggable className={clsx(draggablesClassname)} id={item.id} key={item.id}>
                            {children(item, index)}
                        </Draggable>
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    )
}
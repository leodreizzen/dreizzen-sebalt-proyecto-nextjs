import {useState} from "react";
import AddTagModal from "@/ui/admin/products/add/AddTagModal";
import {Button} from "@nextui-org/button";
import {TagItem} from "@/ui/admin/products/add/AddProductForm";


export default function AddTagForm({onSubmit, className}: {
    onSubmit: (company: TagItem) => void,
    className?: string,
}) {
    const [isOpen, setOpen] = useState(false);

    function onClose() {
        setOpen(false);
    }

    function handleAddPress() {
        setOpen(true);
    }


    return <>
        <Button size={"sm"} onClick={handleAddPress} className={"bg-primary text-white p-2 rounded-2xl"}>Add</Button>
        <AddTagModal className={className} isOpen={isOpen} onClose={onClose} onSubmit={onSubmit}/>
    </>;
}
import {useState} from "react";
import AddCompanyModal from "@/ui/admin/products/add/AddCompanyModal";
import {CompanyItem} from "@/app/admin/products/add/page";


export default function AddCompanyForm({onSubmit, className, type}: {
    onSubmit: (company: CompanyItem) => void,
    className?: string,
    type: "developer" | "publisher"
}) {
    const [isOpen, setOpen] = useState(false);

    function onClose() {
        setOpen(false);
    }

    function handleAddPress() {
        setOpen(true);
    }


    return <>
        <button onClick={handleAddPress} className={"bg-primary text-white p-2 rounded-2xl"}>Add {type}</button>
        <AddCompanyModal className={className} isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} type={type}/>
    </>;
}
import AdminProductForm from "@/ui/admin/products/add/AddProductForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Add product",
    description: "Add a new product to the store"
}

export default function AdminProductAddPage(){
    return <AdminProductForm/>
}
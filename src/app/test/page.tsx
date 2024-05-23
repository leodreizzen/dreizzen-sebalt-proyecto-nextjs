import { productPlaceholders } from "@/data/placeholders";
import ListCard from "@/ui/cards/ListCard";

export default function Page() {
    return (
        <div className="p-2">
            <ListCard product={productPlaceholders[1]} className="w-full" />
        </div>
    )
}
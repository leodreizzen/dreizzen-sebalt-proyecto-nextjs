import { productPlaceholders } from "@/data/placeholders";
import AddToCartButton from "@/ui/AddToCartButton";
import ShoppingCartButton from "@/ui/ShoppingCartButton";
import ListCard from "@/ui/cards/ListCard";

export default function Page() {
    return (
        <div className="w-full h-full">
            <ListCard product={productPlaceholders[0]} />
        </div>
    )
}
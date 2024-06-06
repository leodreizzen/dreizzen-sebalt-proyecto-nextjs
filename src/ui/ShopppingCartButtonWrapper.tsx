import ShoppingCartButton from './navbar/ShoppingCartButton';
import { useShoppingCartContext } from '@/context/ShoppingCartContext';
export default function ShoppingCartButtonWrapper() {
    const cartItems = useShoppingCartContext().shoppingCart.length;
    return (
        <ShoppingCartButton cartItems={cartItems} />
    )
}
import 'server-only'
import {ShoppingCartContextValue, ShoppingCartProvider} from './ShoppingCartContext';
import { addToCart, removeFromCart } from '@/lib/actions';
import { getCart } from '@/lib/session-data';

export default async function ShoppingCartContextWrapper({ children }: {children: React.ReactNode}) {
    const shoppingCart = await getCart();
    const value: ShoppingCartContextValue = {
        shoppingCart: shoppingCart,
        addToCart: addToCart,
        removeFromCart: removeFromCart
    }
    return (
        <ShoppingCartProvider value={value}>
            {children}
        </ShoppingCartProvider>
    )
}
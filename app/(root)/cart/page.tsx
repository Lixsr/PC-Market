import CartTable from "./CartTable";
import { getCart } from "@/lib/actions/cart.actions";
export const metadata = {
  title: "Cart",
};

const CartPage = async () => {
  const cart = await getCart();
  return <CartTable cart={cart}/>;
};

export default CartPage;

import { defaultShippingAddress } from "@/lib/constants";
import { Metadata } from "next";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/actions/cart.actions";
import { getUser } from "@/lib/actions/user.actions";
import ShippingAddressForm from "./ShippingAddressForm";
import CheckoutSteps from "@/components/shared/CheckoutSteps";

export const metadata: Metadata = {
  title: "Shipping Address",
};

const ShippingAddressPage = async () => {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const user = await getUser(userId);
  return (
    <>
      <CheckoutSteps currentStep={1} />
      <ShippingAddressForm
        address={(user.address as ShippingAddress) || defaultShippingAddress}
      />
    </>
  );
};

export default ShippingAddressPage;

import { Metadata } from "next";
import { auth } from "@/auth";
import { getUser } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./PaymentMethodForm";
import CheckoutSteps from "@/components/shared/CheckoutSteps";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/actions/cart.actions";

export const metadata: Metadata = {
  title: "Payment Method",
};
const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const user = await getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const cart = await getCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  return (
    <>
      <CheckoutSteps currentStep={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;

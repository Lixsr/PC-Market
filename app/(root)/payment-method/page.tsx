import { Metadata } from "next";
import { auth } from "@/auth";
import { getUser } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./PaymentMethodForm";

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

  return (
    <>
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;

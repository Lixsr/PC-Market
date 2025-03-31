import { getOrder } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Order Details",
};
const OrderPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const order = await getOrder(id);
  if (!order) notFound();

  return <>ToDo</>;
};

export default OrderPage;

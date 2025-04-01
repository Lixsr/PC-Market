import { getOrder } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./OrderDetailsTable";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Order Details",
};
const OrderPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <>
      <OrderDetailsTable
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        order={{
          ...order,
          itemsPrice: order.itemsPrice.toString(),
          totalPrice: order.totalPrice.toString(),
          shippingPrice: order.shippingPrice.toString(),
          taxPrice: order.taxPrice.toString(),
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
      />
    </>
  );
};

export default OrderPage;

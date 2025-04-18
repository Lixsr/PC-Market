"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useTransition } from "react";

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  createPaypalOrder,
  approvePaypalOrder,
  updateOrderToPaidCOD,
  updateOrderToDelivered,
} from "@/lib/actions/order.actions";
import { Loader } from "lucide-react";

const OrderDetailsTable = ({
  isAdmin,
  order,
  paypalClientId,
}: {
  isAdmin: boolean;
  order: Omit<Order, "paymentResult">;
  paypalClientId: string;
}) => {
  const {
    orderItems,
    itemsPrice,
    shippingAddress,
    taxPrice,
    totalPrice,
    shippingPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    id,
  } = order;
  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";
    if (isPending) {
      status = "Loading PayPal...";
    } else if (isRejected) {
      status = "PayPal Loading Failed";
    }
    return status;
  };
  const handleCreatePaypalOrder = async () => {
    const response = await createPaypalOrder(id);
    if (!response.success) {
      toast.error(response.message, { richColors: true });
    }
    return response.paypalOrderId;
  };
  // id for the order
  // orderID for the paypal order
  const handleApprovePaypalOrder = async (data: { orderID: string }) => {
    const order = await approvePaypalOrder(id, data);
    if (order.success) {
      toast.success(order.message, { richColors: true });
    } else {
      toast.error(order.message, { richColors: true });
    }
  };

  function MarkAsPaidButton() {
    const [isLoading, startTransition] = useTransition();
    return (
      <Button
        type="button"
        className="w-full"
        disabled={isLoading}
        onClick={() => {
          startTransition(async () => {
            const response = await updateOrderToPaidCOD(id);
            if (response.success) {
              toast.success(response.message, { richColors: true });
            } else {
              toast.error(response.message, { richColors: true });
            }
          });
        }}
      >
        {isLoading ? (
          <div className="flex items-center ">
            <Loader className="animate-spin" />
            <span className="ml-4">Processing...</span>
          </div>
        ) : (
          "Mark As Paid"
        )}
      </Button>
    );
  }
  function MarkAsDeliveredButton() {
    const [isLoading, startTransition] = useTransition();
    return (
      <Button
        type="button"
        className="w-full"
        disabled={isLoading}
        onClick={() => {
          startTransition(async () => {
            const response = await updateOrderToDelivered(id);
            if (response.success) {
              toast.success(response.message, { richColors: true });
            } else {
              toast.error(response.message, { richColors: true });
            }
          });
        }}
      >
        {isLoading ? (
          <div className="flex items-center ">
            <Loader className="animate-spin" />
            <span className="ml-4">Processing...</span>
          </div>
        ) : (
          "Mark As Delivered"
        )}
      </Button>
    );
  }

  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y overflow-x-auto">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <div className="mb-2">{paymentMethod}</div>
              {isPaid ? (
                <Badge className="text-green-500" variant="secondary">
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="my-2">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <div>{shippingAddress.fullName}</div>
              <div className="mb-2">
                {shippingAddress.street}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </div>
              {isDelivered ? (
                <Badge className="text-green-500" variant="secondary">
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="my-2">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Place Order</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <div className="px-2">{item.name}</div>
                        </Link>
                      </TableCell>
                      <TableCell className="px-2 text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="py-4 px-2 text-center">
                        ${itemsPrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <p>Items</p>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <p>Tax</p>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <p>Total</p>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {/* PayPal Payment */}
              {!isPaid && paymentMethod === "PayPal" && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePaypalOrder}
                      onApprove={handleApprovePaypalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
              {/* COD Payment */}
              {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;

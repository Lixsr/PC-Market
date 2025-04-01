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
import Image from "next/image";

const OrderDetailsTable = ({ order }: { order: Order }) => {
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
  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
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
              <div className="mb-2">{shippingAddress.fullName}</div>
              <div>
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
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OrderDetailsTable;

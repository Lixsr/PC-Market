import { auth } from "@/auth";
import { getCart } from "@/lib/actions/cart.actions";
import { getUser } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/components/shared/CheckoutSteps";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Place Order",
};

const placeOrderPage = async () => {
  const cart = await getCart();
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found");
  if (!cart || cart.items.length === 0) redirect("/cart");
  const user = await getUser(userId);
  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");
  const address = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps currentStep={3} />
      <h1 className="py-4 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="text-xl pb-4">Shipping Address</div>
              <p>{address.fullName}</p>
              <p>
                {address.street}, {address.city} {address.postalCode},{" "}
                {address.country}
              </p>
              <div className="mt-3 flex justify-end">
                <Link href="/shipping-address">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="text-xl pb-4">Payment Method</div>
              <p>{user.paymentMethod}</p>

              <div className="mt-3 flex justify-end">
                <Link href="/payment-method">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="text-xl pb-4">Items</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
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
                        ${item.price}
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
              <div>{formatCurrency(cart.itemsPrice)}</div>
            </div>
            <div className="flex justify-between">
              <p>Tax</p>
              <div>{formatCurrency(cart.taxPrice)}</div>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <div>{formatCurrency(cart.shippingPrice)}</div>
            </div>
            <div className="flex justify-between">
              <p>Total</p>
              <div>{formatCurrency(cart.totalPrice)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default placeOrderPage;

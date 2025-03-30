"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowRight, Loader } from "lucide-react";
import { Cart } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QuantityControl from "@/components/shared/products/QuantityControl";
import { formatCurrency } from "@/lib/utils";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {cart && cart.items.length > 0 ? (
        <div className="grid md:grid-cols-4 md:gap-4">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
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
                          alt={`Image of ${item.name}`}
                          width={75}
                          height={75}
                        />
                        <span className="pl-4">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <QuantityControl item={item} cart={cart} />
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(item.price) * item.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Subtotal{" "}
                {/* {cart.items.reduce((acc, item) => acc + item.quantity, 0)} */}
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={isLoading}
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
              >
                {isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Checkout
                    <ArrowRight />
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          Cart is empty{" "}
          <Link className="text-blue-800" href="/">
            Go Shopping
          </Link>
        </div>
      )}
    </>
  );
};

export default CartTable;

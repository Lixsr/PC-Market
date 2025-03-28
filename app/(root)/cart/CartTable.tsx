"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addToCart, removeFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Cart, CartItem } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/button";
import QuantityControl from "@/components/shared/products/QuantityControl";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();

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
                    <TableCell className="text-right">{Number(item.price) * item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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

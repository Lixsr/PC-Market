"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addToCart, removeFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Cart } from "@/types";
import Link from "next/link";
import Image from "next/image";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useTransition();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {cart && cart.items.length > 0 ? (
        <div className="grid md:grid-cols-4 md:gap-4">
          <div className="overflow-x-auto md:col-span-3"></div>
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

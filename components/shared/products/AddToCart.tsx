"use client";
import { Cart, CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Loader } from "lucide-react";
import { toast } from "sonner";
import { addToCart, removeFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const router = useRouter();
  const [isAddLoading, setIsAddLoading] = useTransition();
  const [isRemoveLoading, setIsRemoveLoading] = useTransition();

  const handleAddToCart = async () => {
    setIsAddLoading(async () => {
      const response = await addToCart(item);

      if (response && !response.success) {
        toast.error(response.message || "Failed to add item to cart", {
          duration: 2000,
          richColors: true,
        });
        return;
      }

      toast.success(`${item.name} added to cart`, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 2000,
      });
    });
  };
  const handleRemoveFromCart = async () => {
    setIsRemoveLoading(async () => {
      const response = await removeFromCart(item.productId);
      console.log(response);
      if (response && !response.success) {
        toast.error(response.message || "Failed to remove item from cart", {
          duration: 2000,
          richColors: true,
        });
        return;
      }

      toast.success(`${item.name} removed from cart`, {
        duration: 2000,
      });
    });
  };
  const existingItem =
    cart && cart.items.find((i) => i.productId === item.productId);
  if (existingItem) {
    return (
      <div className="flex items-center gap-2">
        <Button
          disabled={isRemoveLoading || isAddLoading}
          type="button"
          variant="outline"
          onClick={handleRemoveFromCart}
        >
          {isRemoveLoading ? <Loader className="animate-spin" /> : <Minus />}
        </Button>
        <span>{existingItem.quantity}</span>
        <Button
          type="button"
          disabled={isRemoveLoading || isAddLoading}
          variant="outline"
          onClick={handleAddToCart}
        >
          {isAddLoading ? <Loader className="animate-spin" /> : <Plus />}
        </Button>
      </div>
    );
  }
  return (
    <Button
      className="w-full"
      disabled={isAddLoading}
      type="button"
      onClick={handleAddToCart}
    >
      {isAddLoading ? <Loader className="animate-spin" /> : <Plus />} Add to
      Cart
    </Button>
  );
};

export default AddToCart;

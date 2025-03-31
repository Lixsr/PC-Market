"use client";

import { useRouter } from "next/navigation";
import { placeOrder } from "@/lib/actions/order.actions";
import { Loader, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

const PlaceOrderForm = () => {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await placeOrder();
    if (response) {
      router.push(`/order/${response.redirectTo}`);
    }
  };
  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        {pending ? <Loader className="animate-spin" /> : <Check />}
        Place Order
      </Button>
    );
  };
  return (
    <form onSubmit={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;

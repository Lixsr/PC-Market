"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { paymentMethodSchema } from "@/lib/validators";
import { checkoutSteps, DEFAULT_PAYMENT_METHOD } from "@/lib/constants";
import CheckoutSteps from "@/components/shared/CheckoutSteps";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    defaultValues: {
      paymentMethod: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
    resolver: zodResolver(paymentMethodSchema),
  });
  return (
    <>
      <CheckoutSteps currentStep={2} />
      {preferredPaymentMethod}
    </>
  );
};

export default PaymentMethodForm;

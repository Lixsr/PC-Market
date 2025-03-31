"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { paymentMethodSchema } from "@/lib/validators";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader, ArrowRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updatePaymentMethod } from "@/lib/actions/cart.actions";

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
  async function handleSubmit(values: z.infer<typeof paymentMethodSchema>) {
    startTransition(async () => {
      const response = await updatePaymentMethod(values);
      if (!response.success) {
        toast.error("We were unable to update your payment method");
        return;
      }
      router.push("/place-order");
    });

    return;
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4">Payment Method</h1>
      <p className="text-sm text-muted-foreground">Select a Payment Method</p>
      <Form {...form}>
        <form
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex flex-col md:flex-row gap-5">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-2"
                    >
                      {PAYMENT_METHODS.map((paymentMethod) => (
                        <FormItem
                          key={paymentMethod}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={paymentMethod}
                              checked={field.value === paymentMethod}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {paymentMethod}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 ">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader className="animate-spin" /> : <ArrowRight />}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentMethodForm;

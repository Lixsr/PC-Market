"use client";
import { ShippingAddress } from "@/types";
import { defaultShippingAddress } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateAddress } from "@/lib/actions/user.actions";
const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || defaultShippingAddress,
  });

  const handleSubmit: SubmitHandler<
    z.infer<typeof shippingAddressSchema>
  > = async (values) => {
    startTransition(async () => {
      const response = await updateAddress(values);
      if (!response.success) {
        toast.error("We were unable to update your address");
        console.log(response.message);
        return;
      }
      router.push("/payment-method");
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4">Shipping Address</h1>
      <p className="text-sm text-muted-foreground">Enter your Address</p>
      <Form {...form}>
        <form
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex flex-col md:flex-row gap-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "fullName"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <FormField
              control={form.control}
              name="street"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "street"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="Street" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <FormField
              control={form.control}
              name="city"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "city"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <FormField
              control={form.control}
              name="postalCode"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "postalCode"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Postal Code" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <FormField
              control={form.control}
              name="country"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "country"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field}></Input>
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

export default ShippingAddressForm;

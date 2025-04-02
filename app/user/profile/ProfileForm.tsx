"use client";
import { useSession } from "next-auth/react";
import { updateProfileSchema } from "@/lib/validators";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { UpdateProfile } from "@/types";
import { updateUserProfile } from "@/lib/actions/user.actions";

const ProfileForm = () => {
  const { data: session, update } = useSession();
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      // ?? checks for null or undefined only
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });
  const handleSubmit = async (data: UpdateProfile) => {
    const response = await updateUserProfile(data);
    if (!response.success) {
      return toast.error(response.message);
    }
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data.name,
      },
    };
    await update(newSession);
    toast.success("Profile updated successfully", { richColors: true });
  };

  return (
    <Form {...form}>
      <form
        method="post"
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    disabled
                    placeholder="Email"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Name"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="button col-span-2 w-full"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          
        >
          {form.formState.isSubmitting ? (
            <Loader className="animate-spin" />
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  );
};
export default ProfileForm;

"use client";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultReview } from "@/lib/constants";
import { insertReviewSchema } from "@/lib/validators";
import { z } from "zod";
import { Loader, StarIcon } from "lucide-react";
import { toast } from "sonner";
import { publishReview, getUserReview } from "@/lib/actions/review.actions";
const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: defaultReview,
  });
  // open form handler
  const openForm = async () => {
    form.setValue("userId", userId);
    form.setValue("productId", productId);
    const currentUserReview = await getUserReview({ productId });
    if (currentUserReview) {
      form.setValue("title", currentUserReview.title);
      form.setValue("description", currentUserReview.description);
      form.setValue("rating", currentUserReview.rating);
    }

    setOpen(true);
  };
  // handle form submission
  const handleSubmit: SubmitHandler<
    z.infer<typeof insertReviewSchema>
  > = async (data) => {
    const response = await publishReview({
      ...data,
      productId,
    });
    if (!response.success) {
      toast.error(response.message, { richColors: true });
      return;
    }
    setOpen(false);
    onReviewSubmitted();
    toast.success("Review published successfully", {
      richColors: true,
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={openForm}>Write a Review</Button>
      <DialogContent className="sm:max-w-[480px]">
        <Form {...form}>
          <form method="POST" onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a review</DialogTitle>
              <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <SelectItem
                            key={index}
                            value={(index + 1).toString()}
                            className="cursor-pointer"
                          >
                            <div className="flex">
                              <span className="mx-2">{index + 1}</span>
                              {Array.from({ length: index + 1 }).map(
                                (_, innerIndex) => (
                                  <StarIcon
                                    key={innerIndex}
                                    className="inline h-4 w-4"
                                  />
                                )
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;

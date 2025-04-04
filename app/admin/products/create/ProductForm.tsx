'use client';

// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { z } from "zod";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultProduct } from "@/lib/constants";
import { Form } from "@/components/ui/form";

const ProductForm = ({
  type,
  product,
//   productId,
}: {
  type: "create" | "update";
  product?: Product;
  productId?: string;
}) => {
//   const router = useRouter();
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(
      type === "create" ? insertProductSchema : updateProductSchema
    ),
    defaultValues: product && type === "create" ? defaultProduct : product,
  });
  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Name */}
          {/* Slug */}
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Category */}
          {/* Brand */}
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Price */}
          {/* Stock  */}
        </div>
        <div className="upload-field flex flex-col gap-5 md:flex-row">
          {/* Images */}
        </div>
        <div className="upload-field">{/* Is Featured */}</div>
        <div>{/* Description */}</div>
        <div>{/* Submit */}</div>
      </form>
    </Form>
  );
};

export default ProductForm;

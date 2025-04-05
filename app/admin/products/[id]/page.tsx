import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductById } from "@/lib/actions/product.actions";
import { requireAdmin } from "@/lib/auth-guard";
import ProductForm from "../ProductForm";

export const metadata: Metadata = {
  title: "Update Product",
};

const UpdateProductPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  await requireAdmin();
  const { id } = await props.params;
  const product = await getProductById(id);
  if (!product) return notFound();
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update a Product</h1>
      <ProductForm type="update" product={product} productId={product.id} />
    </div>
  );
};

export default UpdateProductPage;

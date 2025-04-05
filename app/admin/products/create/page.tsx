import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import ProductForm from "../ProductForm";
export const metadata: Metadata = {
  title: "Create Product",
};

const CreateProductPage = async () => {
  await requireAdmin();
  return (
    <>
      <h2 className="h2-bold">Create a Product</h2>
      <div className="my-8">
        <ProductForm type="create" />
      </div>
    </>
  );
};

export default CreateProductPage;

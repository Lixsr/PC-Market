import { getProduct } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/products/ProductPrice";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  // slug is a promise, we need to await it
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) {
    // send user to not found page
    return notFound();
  }
  return (
    <main className="grid grid-cols-1 md:grid-cols-5">
      <section className="col-span-2"></section>

      <section className="col-span-2 p-4">
        <div className="flex flex-col gap-6">
          <p>
            {product.brand} {product.category}
          </p>
          <h3 className="h3-bold">{product.name}</h3>
          <p className="flex gap-1">
            {product.rating} <Star /> of {product.numReviews} Reviews
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <ProductPrice
              value={Number(product.price)}
              className="w-fit rounded-full bg-green-200 text-green-700 px-5 py-2"
            />
          </div>
        </div>
        <div className="mt-10">
          <p className="font-semibold">Description</p>
          <p>{product.description}</p>
        </div>
      </section>
      <section>
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex justify-between">
              <p className="md:hidden lg:block">Price</p>
              <div>
                <ProductPrice value={Number(product.price)} />
              </div>
            </div>
            <div className="mb-2 flex justify-between">
              <p className="md:hidden lg:block">Status</p>
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-center">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-center">
                  Out of Stock
                </Badge>
              )}
            </div>
            {product.stock > 0 && (
              <div className="flex-center">
                <Button className="w-full">Add To Cart</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default ProductDetailsPage;

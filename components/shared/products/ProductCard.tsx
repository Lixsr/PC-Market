import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./ProductPrice";
import { Product } from "@/types";
import Rating from "./Rating";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="shadow-md w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={
              product.images === null || product.images.length === 0
                ? "/assets/no-image.jpg"
                : product.images[0]
            }
            alt={product.name}
            width={400}
            height={400}
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="font-medium text-sm">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <div className="flex gap-2">
            <Rating value={Number(product.rating)} />
          </div>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <span className="text-destructive">Out of Stock</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

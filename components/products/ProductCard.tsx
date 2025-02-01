import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="bg-white shadow-md w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
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
          <p className="flex gap-2">
            {product.rating} <Star />
          </p>
          {product.stock > 0 ? (
            <span className="font-bold">${product.price}</span>
          ) : (
            <span className="text-destructive">Out of Stock</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

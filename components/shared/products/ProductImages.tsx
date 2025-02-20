"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
const ProductImages = ({
  images,
  name,
}: {
  images: string[];
  name: string;
}) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  return (
    <div className="space-y-4">
      <Image
        src={selectedImage}
        alt={`${name} image`}
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex gap-4">
        {images.map((image) => (
          <div
            key={image}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "border-2 rounded cursor-pointer mr-2 hover:border-gray-500",
              selectedImage === image && "border-gray-900"
            )}
          >
            <Image
              src={image}
              alt={`${name} image`}
              width={100}
              height={100}
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;

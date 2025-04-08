"use client";
import { useEffect, useState } from "react";
import { Calendar, Check, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { Review } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReviewForm from "../ReviewForm";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const reload = () => {
    return;
  };
  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No Reviews</div>}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div>
          Please{" "}
          <Link
            className="text-blue-500"
            href={`/api/auth/signin?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>{" "}
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">{/* Display Reviews */}</div>
    </div>
  );
};
export default ReviewList;

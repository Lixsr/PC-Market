"use client";
import { useEffect, useState } from "react";
import { Calendar, User } from "lucide-react";
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
import { getReviews } from "@/lib/actions/review.actions";
import Rating from "@/components/shared/products/Rating";

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

  useEffect(() => {
    // Load reviews
    const loadReviews = async () => {
      setReviews((await getReviews({ productId })).reviews);
    };
    loadReviews();
  }, [productId]);
  const reload = async () => {
    const { reviews } = await getReviews({ productId });
    setReviews([...reviews]);
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
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  {review.user ? review.user.name : "Deleted User"}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ReviewList;

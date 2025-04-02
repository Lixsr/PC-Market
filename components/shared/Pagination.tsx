"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { createUrlQuery } from "@/lib/utils";

const Pagination = ({
  page,
  totalPages,
  urlParamName,
}: {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (action: "previous" | "next") => {
    const newPage = action === "previous" ? Number(page) - 1 : Number(page) + 1;
    const newUrl = createUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: newPage.toString(),
    });
    router.push(newUrl);
  };

  return (
    <div className="flex gap-2 justify-center space-x-4">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        disabled={Number(page) <= 1}
        onClick={() => handleClick("previous")}
      >
        Previous
      </Button>
      <div className="flex items-center justify-center ">
        {page} of {totalPages}
      </div>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick("next")}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;

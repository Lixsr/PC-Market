"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex-center flex-col min-h-screen">
      <Image
        src="/images/logo.svg"
        alt={`${APP_NAME} Logo`}
        width={48}
        height={48}
        priority={true}
      />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">The requested page is not found</p>
        {/* asChild allows the click on the entire width of the button. not the text only */}
        <Button variant="outline" className="mt-4 ml-2" asChild>
          <Link href="/">Go back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;

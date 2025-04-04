import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized",
};

const Unauthorized = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center space-y-8 h-[calc(100vh-200px)]">
      <h1 className="h1-bold text-4xl">Unauthorized Access</h1>
      <p className="text-muted-foreground">
        You do not have permission to view this page.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
};

export default Unauthorized;

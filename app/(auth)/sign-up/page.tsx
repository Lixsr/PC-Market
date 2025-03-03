import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import SignUpForm from "./SignUpForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account",
};

const SignUpPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  // get the session
  const session = await auth();
  if (session) {
    // redirect to the home page if the user is already signed in
    return redirect(callbackUrl || "/");
  }
  return (
    <div className="w-full border max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} Logo`}
              width={100}
              height={100}
              priority={true}
            />
          </Link>
          <CardTitle className="text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create an account
          </CardDescription>
          <CardContent className="space-y-4">
            <SignUpForm />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SignUpPage;

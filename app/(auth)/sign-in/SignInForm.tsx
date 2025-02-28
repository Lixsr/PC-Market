"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultCredentials } from "@/lib/constants";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

const SignInForm = () => {
  const [state, signIn] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" variant="default" disabled={pending}>
        { pending ? "Signing in..." : "Sign In" }
      </Button>
    );
  };
  return (
    <form action={signIn}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={defaultCredentials.email}
          />
        </div>
        <div>
          <Label htmlFor="password">password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="password"
            defaultValue={defaultCredentials.password}
          />
        </div>
        <div>
          <SignInButton />
        </div>

        {state && !state.success && (
          <div className="text-center text-destructive">{state.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Don&apos; have an account?{" "}
          <Link href="/sign-up" target="_self" className="link">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;

"use server";
import { signInSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Sign in
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    // extract the email and password from the form data
    const user = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    // If the error is a redirect error, throw it to redirect the user
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid Credentials" };
  }
}

// Sign out
export async function signOutUser() {
  await signOut();
}

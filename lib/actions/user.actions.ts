"use server";
import { signInSchema, signUpSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";

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
// Sign up
export async function signUpWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signUpSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    const originalPassword = user.password;
    // hash the password
    user.password = hashSync(user.password, 10);
    // create the user
    await prisma.user.create({
      data: { name: user.name, email: user.email, password: user.password },
    });
    await signIn("credentials", {
      email: user.email,
      password: originalPassword,
    });
    return { success: true, message: "Signed up successfully" };
  } catch (error) {
    // If the error is a redirect error, throw it to redirect the user
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "User was not registered" };
  }
}

// Sign out
export async function signOutUser() {
  await signOut();
}

"use server";
import {
  shippingAddressSchema,
  signInSchema,
  signUpSchema,
} from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";

// Get User
export async function getUser(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// Update Address
export async function updateAddress(newAddress: ShippingAddress) {
  try {
    const session = await auth();
    const user = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const address = shippingAddressSchema.parse(newAddress);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        address,
      },
    });
    return { success: true, message: "User address updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update User Profile
export async function updateUserProfile({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  try {
    const session = await auth();
    const user = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.email !== email) {
      throw new Error("Email address updates are not allowed at the moment.");
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
      },
    });
    return { success: true, message: "User profile updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const totalUsers = await prisma.user.count();
  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    totalPages,
  };
}

// Delete user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

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
    return { success: false, message: formatError(error) };
  }
}

// Sign out
export async function signOutUser() {
  await signOut();
}

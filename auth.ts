import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { cookies } from "next/headers";
import { authConfig } from "./auth.config";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials.email == null) {
          return null;
        }
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // If no error and we have user data, return it
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          // If the password matches, return the user data
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // Return null if user data does not exist or wrong password
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Add the user id to the session from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // ToDo: Add Image to the session

      // if update
      if (trigger === "update") {
        // Add the user role to the session from the token
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user details to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // if user is anonymous, set the name to the email
        if (user.name === "Anonymous") token.name = user.email!.split("@")[0];
        // update DB with the token name
        await prisma.user.update({
          where: { id: user.id },
          data: { name: token.name },
        });
        if (trigger === "signUp" || trigger === "signIn") {
          const cookiesOjb = await cookies();
          const sessionCartId = cookiesOjb.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });
            if (sessionCart) {
              // update the cart with the user id
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }
      // Handle session updates
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },
    ...authConfig.callbacks,
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

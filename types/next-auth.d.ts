import { DefaultSession } from "next-auth";
declare module "next-auth" {
  export interface Session {
    user: {
      // Add custom properties here
      role: string;
      image: string;
    } & DefaultSession["user"];
  }
}

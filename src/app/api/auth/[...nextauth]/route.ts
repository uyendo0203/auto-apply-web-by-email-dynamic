import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

let handler: any;

try {
  handler = (NextAuth as any)(authOptions);
} catch (error) {
  console.error("NextAuth initialization error:", error);
  throw error;
}

export { handler as GET, handler as POST };

import NextAuthLib from "next-auth";
import { authOptions } from "@/lib/auth";

const NextAuth = (NextAuthLib as any).default || NextAuthLib;
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

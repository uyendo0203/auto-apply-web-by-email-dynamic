import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

console.log("🔍 Auth Config Loading...");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "✓ Set" : "❌ Missing");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✓ Set" : "❌ Missing");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✓ Set" : "❌ Missing");

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/gmail.send",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  basePath: "/api/auth",
  secret: process.env.NEXTAUTH_SECRET!,
  trustHost: true,
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: any }) {
      console.log("🔐 JWT callback");
      if (account) {
        token.accessToken = account.access_token as string;
        token.refreshToken = account.refresh_token as string;
        token.expiresAt = account.expires_at as number;
        console.log("✅ Tokens stored in JWT");
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("📊 Session callback");
      const sessionData = session as any;
      sessionData.accessToken = token.accessToken;
      sessionData.refreshToken = token.refreshToken;
      sessionData.expiresAt = token.expiresAt;
      console.log("✅ Session data set");
      return sessionData;
    },
  },
} as const;

const result = (NextAuth as any)(authConfig);
console.log("✅ NextAuth initialized");

export const handlers = result.handlers;
export const auth = result.auth;
export const signIn = result.signIn;
export const signOut = result.signOut;


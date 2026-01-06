import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Debug logging
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
      try {
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.expiresAt = account.expires_at;
          console.log("✅ JWT updated with account data");
        }

      // Check if token has expired and refresh if needed
      if (token.expiresAt && Date.now() >= (token.expiresAt as number) * 1000) {
        console.log("🔄 Token expired, attempting to refresh...");
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string,
            }),
          });

          const refreshedTokens = await response.json();

          if (!response.ok) {
            throw new Error(
              `Google OAuth token refresh failed: ${refreshedTokens.error_description || refreshedTokens.error}`
            );
          }

          console.log("✅ Token refreshed successfully");
          return {
            ...token,
            accessToken: refreshedTokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000) + (refreshedTokens.expires_in || 3600),
          };
        } catch (error) {
          console.error("❌ Error refreshing token:", error);
          // Return token as-is if refresh fails, will trigger re-authentication
          return token;
        }
      }

      return token;
      } catch (error) {
        console.error("❌ JWT callback error:", error);
        return token;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      try {
        if (session) {
          // Type assertion to bypass TypeScript strict checking
          const extendedSession = session as any;
          extendedSession.accessToken = token.accessToken || null;
          extendedSession.refreshToken = token.refreshToken || null;
          extendedSession.expiresAt = token.expiresAt || null;
          console.log("✅ Session updated with token data");
        }
        return session;
      } catch (error) {
        console.error("❌ Session callback error:", error);
        throw error;
      }
    },
  },
} as const;

const result = (NextAuth as any)(authConfig);
console.log("✅ NextAuth initialized successfully");
console.log("Handlers available:", !!result.handlers);

export const handlers = result.handlers;
export const auth = result.auth;
export const signIn = result.signIn;
export const signOut = result.signOut;


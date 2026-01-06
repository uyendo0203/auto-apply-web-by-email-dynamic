import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth/next";

export const authOptions: any = {
  providers: [
    GoogleProvider({
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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, trigger, session }: any) {
      try {
        if (account) {
          console.log("🔐 JWT callback - account found:", {
            provider: account.provider,
            hasAccessToken: !!account.access_token,
          });
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.expiresAt = account.expires_at;
        }
        return token;
      } catch (error) {
        console.error("❌ JWT callback error:", error);
        throw error;
      }
    },
    async session({ session, token, user }: any) {
      try {
        console.log("📋 Session callback - session found:", !!session);
        if (session && session.user) {
          session.accessToken = token.accessToken;
          session.refreshToken = token.refreshToken;
          session.expiresAt = token.expiresAt;
        }
        return session;
      } catch (error) {
        console.error("❌ Session callback error:", error);
        throw error;
      }
    },
  },
};

export const auth = () => getServerSession(authOptions);


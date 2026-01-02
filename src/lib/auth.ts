import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

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
          scope: "openid email profile https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/gmail.send",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  trustHost: true,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }
}


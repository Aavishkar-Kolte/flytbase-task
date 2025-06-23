import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import type { AuthOptions } from "next-auth";
import type { Account, Profile, User } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: {
      user: User;
      account: Account | null;
      profile?: Profile;
    }) {
      if (!profile || !profile.email || !profile.name) return false;
      // Check if user exists in API by email
      const apiBase = "http://localhost:3001/api";
      try {
        const userRes = await axios.get(`${apiBase}/users?email=${profile.email}`);
        if (userRes.data && userRes.data.length > 0) {
          // User exists, allow sign in
          return true;
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (!err.response || err.response.status !== 404) {
            console.error("Error checking user existence", err);
            return false;
          }
        } else {
          console.error("Unknown error", err);
          return false;
        }
      }
      // User does not exist, create org and user
      try {
        const orgRes = await axios.post(`${apiBase}/organizations`, {
          name: `${profile.name}'s Org`,
        });
        const orgId = orgRes.data.id;
        await axios.post(`${apiBase}/users`, {
          name: profile.name,
          email: profile.email,
          role: "admin",
          is_root: true,
          org_id: orgId,
          status: "active",
          google_id: (profile as any).sub || (profile as any).id,
        });
        return true;
      } catch (err: unknown) {
        console.error("Error creating org/user", err);
        return false;
      }
    },
    async session({ session, token, user }) {
      // Add name and email to session.user
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password!
        );

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your email to continue.");
        }

        const { password, ...userWithNoPassword } = user;

        return userWithNoPassword;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }: any) {
      if (token || user) {
        session.user = { ...user, ...token };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

// const handler = NextAuth(authOptions);
const handler = NextAuth({
  ...authOptions,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 }, // 1 day compliant with BE
});

export { handler as GET, handler as POST };

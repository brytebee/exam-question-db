import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
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

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }: any) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  // events: {
  //   async createUser({ user }) {
  //     const token = randomBytes(32).toString("hex");
  //     const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}&email=${user.email}`;

  //     await prisma.verificationToken.create({
  //       data: {
  //         identifier: user.email!,
  //         token,
  //         expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token expires in 24 hours
  //       },
  //     });

  //     const transporter = nodemailer.createTransport({
  //       service: "Gmail",
  //       auth: {
  //         user: process.env.EMAIL_FROM,
  //         pass: process.env.EMAIL_PASSWORD,
  //       },
  //     });

  //     await transporter.sendMail({
  //       from: process.env.EMAIL_FROM,
  //       to: user.email!,
  //       subject: "Verify your email address",
  //       html: `<p>Please verify your email address by clicking on the link below:</p><p><a href="${verificationUrl}">Verify Email</a></p>`,
  //     });
  //   },
  // },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// TermiLingo - Authentication Configuration
// NextAuth.js ile kullanıcı kimlik doğrulama

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // GitHub OAuth (tercihen geliştiriciler için)
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Email/Password (Credentials)
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "ornek@email.com",
        },
        password: {
          label: "Parola",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Parola hash kontrolü (crypto ile)
        const [salt, storedHash] = user.passwordHash.split(":");
        const derivedKey = crypto.scryptSync(credentials.password, salt, 64).toString("hex");
        const isValid = derivedKey === storedHash;
        
        if (!isValid) {
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = (user as any).role || "TRANSLATOR";
      }
      if (account && profile) {
        token.picture = (profile as any)?.picture || (profile as any)?.image;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        // OAuth ile giriş - kullanıcı var mı kontrol et
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Yeni kullanıcı oluştur
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || user.email!.split("@")[0],
              role: "TRANSLATOR",
              image: user.image || (profile as any)?.picture || (profile as any)?.image,
            },
          });
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  pages: {
    signIn: "/giris", // Custom login page
  },
};

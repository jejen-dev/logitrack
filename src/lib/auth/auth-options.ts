import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user }) {
            return typeof user.email === "string" && user.email.length > 0;
        },

        async jwt({ token, user, account }) {
            if (user?.email) {
                const email = user.email.trim().toLowerCase();
                const appUser = await prisma.user.upsert({
                    where: { email },
                    create: {
                        email,
                        name: user.name?.trim() || email,
                        passwordHash: null,
                        role: "OPERATOR",
                    },
                    update: {
                        name: user.name?.trim() || email,
                    },
                    select: {
                        id: true,
                        role: true,
                    },
                });

                token.id = appUser.id;
                token.role = appUser.role;
                token.authProvider = account?.provider;
            } else if (token.id) {
                const appUser = await prisma.user.findUnique({
                    where: { id: token.id },
                    select: { role: true },
                });

                // JWTs outlive database role changes, so refresh the role on
                // each session read instead of trusting the original claim.
                token.role = appUser?.role ?? "";
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
};

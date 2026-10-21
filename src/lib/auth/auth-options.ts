import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { authPrisma } from "@/lib/prisma";

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
        async signIn({ user, profile }) {
            const googleProfile = profile as { email_verified?: boolean } | undefined;
            return typeof user.email === "string" && user.email.length > 0 && googleProfile?.email_verified === true;
        },

        async jwt({ token, user, account }) {
            if (user?.email) {
                const email = user.email.trim().toLowerCase();
                let appUser = await authPrisma.user.findUnique({
                    where: { email },
                    select: { id: true, role: true, merchantId: true },
                });

                if (!appUser) {
                    const invitation = await authPrisma.merchantInvitation.findFirst({
                        where: { email, acceptedAt: null, expiresAt: { gt: new Date() } },
                        orderBy: { createdAt: "desc" },
                        select: { role: true },
                    });
                    if (invitation) {
                        appUser = await authPrisma.user.create({
                            data: { email, name: user.name?.trim() || email, role: invitation.role },
                            select: { id: true, role: true, merchantId: true },
                        });
                    } else {
                        appUser = await authPrisma.$transaction(async (tx) => {
                            const created = await tx.user.create({
                                data: { email, name: user.name?.trim() || email, role: "ADMIN" },
                                select: { id: true, role: true, merchantId: true },
                            });
                            const merchant = await tx.merchant.create({
                                data: { name: `${user.name?.trim() || email}'s merchant`, ownerId: created.id },
                            });
                            return tx.user.update({
                                where: { id: created.id },
                                data: { merchantId: merchant.id },
                                select: { id: true, role: true, merchantId: true },
                            });
                        });
                    }
                } else if (user.name?.trim()) {
                    await authPrisma.user.update({ where: { id: appUser.id }, data: { name: user.name.trim() } });
                }

                token.id = appUser.id;
                token.role = appUser.role;
                token.merchantId = appUser.merchantId ?? undefined;
                token.isMerchantOwner = appUser.merchantId
                    ? !!(await authPrisma.merchant.findUnique({ where: { ownerId: appUser.id }, select: { id: true } }))
                    : false;
                token.authProvider = account?.provider;
            } else if (token.id) {
                const appUser = await authPrisma.user.findUnique({
                    where: { id: token.id },
                    select: { role: true, merchantId: true, ownedMerchant: { select: { id: true } } },
                });

                // JWTs outlive database role changes, so refresh the role on
                // each session read instead of trusting the original claim.
                token.role = appUser?.role ?? "";
                token.merchantId = appUser?.merchantId ?? undefined;
                token.isMerchantOwner = !!appUser?.ownedMerchant;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.merchantId = token.merchantId;
                session.user.isMerchantOwner = token.isMerchantOwner;
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
};

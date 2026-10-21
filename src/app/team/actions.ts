"use server";

import { createHash, randomBytes } from "node:crypto";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth/auth-options";
import { authPrisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/enums";

const inviteRoles: UserRole[] = ["MANAGER", "OPERATOR", "DRIVER"];

export async function createMerchantInvitation(formData: FormData) {
  const session = await getServerSession(authOptions);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "OPERATOR") as UserRole;
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  if (!inviteRoles.includes(role)) throw new Error("Invalid team role.");

  const merchantId = session.user.merchantId;
  if (!merchantId) throw new Error("Merchant membership required.");
  const merchant = await authPrisma.merchant.findFirst({
    where: { id: merchantId },
    select: { id: true, ownerId: true },
  });
  if (!merchant || (!session.user.isMerchantOwner && session.user.role !== "ADMIN")) {
    throw new Error("Only the merchant owner or an administrator can invite team members.");
  }

  const existingUser = await authPrisma.user.findUnique({ where: { email }, select: { merchantId: true } });
  if (existingUser?.merchantId) throw new Error("This email already belongs to a merchant.");
  const pendingInvitation = await authPrisma.merchantInvitation.findFirst({
    where: { email, acceptedAt: null, expiresAt: { gt: new Date() } },
    select: { merchantId: true },
  });
  if (pendingInvitation && pendingInvitation.merchantId !== merchant.id) {
    throw new Error("This email already has an active invitation to another merchant.");
  }
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await authPrisma.merchantInvitation.updateMany({
    where: { merchantId: merchant.id, email, acceptedAt: null },
    data: { expiresAt: new Date() },
  });
  await authPrisma.merchantInvitation.create({
    data: { merchantId: merchant.id, email, role, tokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  });
  revalidatePath("/team");
  revalidatePath("/users");
  const baseUrl = process.env.NEXTAUTH_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return { email, link: new URL(`/join/${token}`, baseUrl).toString() };
}

export async function acceptMerchantInvitation(token: string) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase();
  if (!session?.user?.id || !email) throw new Error("Sign in with the invited Google account first.");
  if (session.user.merchantId) throw new Error("This account is already a member of a merchant.");
  if (typeof token !== "string" || token.length < 32 || token.length > 128) throw new Error("Invalid invitation link.");
  const tokenHash = createHash("sha256").update(token).digest("hex");

  await authPrisma.$transaction(async (tx) => {
    const invitation = await tx.merchantInvitation.findFirst({
      where: { tokenHash, email, acceptedAt: null, expiresAt: { gt: new Date() } },
      select: { id: true, merchantId: true, role: true },
    });
    if (!invitation) throw new Error("Invitation is invalid, expired, or addressed to another email.");
    const claimed = await tx.merchantInvitation.updateMany({
      where: { id: invitation.id, acceptedAt: null, expiresAt: { gt: new Date() } },
      data: { acceptedAt: new Date() },
    });
    if (claimed.count !== 1) throw new Error("This invitation has already been used.");
    const joined = await tx.user.updateMany({
      where: { id: session.user.id, email, merchantId: null },
      data: { merchantId: invitation.merchantId, role: invitation.role },
    });
    if (joined.count !== 1) throw new Error("This account is already a member of a merchant.");
  }, { isolationLevel: "Serializable" });
  return { success: true };
}

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import { AcceptInvite } from "./accept-invite";
import { LocalizedText } from "@/components/locale-provider";

export default async function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/login?callbackUrl=${encodeURIComponent(`/join/${token}`)}`);
  if (session.user.merchantId) redirect("/dashboard");
  return <main className="flex min-h-screen items-center justify-center p-4"><div className="glass-surface w-full max-w-lg space-y-4 rounded-2xl p-8"><h1 className="text-2xl font-semibold"><LocalizedText text={"Join a merchant team"} /></h1><p className="text-sm text-slate-600"><LocalizedText text={"Signed in as "} />{session.user.email}<LocalizedText text={". Accept the invitation to join this merchant. This Google account cannot create a separate merchant."} /></p><AcceptInvite token={token} /></div></main>;
}

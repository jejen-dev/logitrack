import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { LocalizedText } from "@/components/locale-provider";

export default async function JoinInstructionsPage() {
  const session = await getServerSession(authOptions);
  return <main className="flex min-h-screen items-center justify-center p-4"><section className="glass-surface w-full max-w-lg space-y-4 rounded-2xl p-8"><h1 className="text-2xl font-semibold"><LocalizedText text={"Merchant invitation required"} /></h1><p className="text-sm text-slate-600"><LocalizedText text={session?.user?.email ? `Signed in as ${session.user.email}.` : "Sign in using the Google account invited by your merchant owner."} /> <LocalizedText text={" Open the valid invitation link sent to your email. An account that has been invited cannot create a separate merchant."} /></p><Link className="text-sm text-blue-700 underline" href="/login"><LocalizedText text={"Sign in with Google"} /></Link></section></main>;
}

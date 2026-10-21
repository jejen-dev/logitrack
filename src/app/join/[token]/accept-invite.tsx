"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { acceptMerchantInvitation } from "@/app/team/actions";
import { Button } from "@/components/ui/button";
import { LocalizedText } from "@/components/locale-provider";

export function AcceptInvite({ token }: { token: string }) {
  const { update } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function accept() {
    setBusy(true); setError("");
    try { await acceptMerchantInvitation(token); await update(); router.replace("/dashboard"); router.refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not accept invitation."); setBusy(false); }
  }
  return <div className="space-y-3"><Button type="button" onClick={accept} disabled={busy}>{busy ? <LocalizedText text="Joining…" /> : <LocalizedText text="Accept invitation" />}</Button>{error && <p role="alert" className="text-sm text-red-600"><LocalizedText text={error} /></p>}</div>;
}

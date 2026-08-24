"use client";

import { useSession } from "next-auth/react";

export default function SessionDebugPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (!session) {
    return <p>Not authenticated.</p>;
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-2xl font-bold">Session Debug</h1>

      <pre className="rounded-lg bg-slate-100 p-6 text-sm">
        {JSON.stringify(session, null, 2)}
      </pre>
    </main>
  );
}

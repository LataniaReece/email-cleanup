"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import { getSession } from "./actions";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [emailCount, setEmailCount] = useState<number | null>(null);

  useEffect(() => {
    const getServerSession = async () => {
      const session = await getSession();
      if (!session) redirect("/api/auth/signin");
      setSession(session);
    };
    getServerSession();
  }, []);

  const fetchEmailCount = async () => {
    const res = await fetch("/api/gmail/summary");
    const data = await res.json();
    setEmailCount(data.totalEmails);
  };

  return (
    <div className="flex flex-col column items-center align-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p>Hello {session?.user?.name}</p>
      <p>{session?.user?.email}</p>

      <button
        className="rounded-lg border border-slate-300 hover:border-slate-400 px-3 py-2"
        onClick={fetchEmailCount}
      >
        Check Inbox Size
      </button>

      {emailCount !== null && (
        <p className="text-lg">You have {emailCount} emails in your inbox</p>
      )}

      <button
        className="rounded-lg border border-slate-300 hover:border-slate-400 px-2 py-1"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}

import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authConfig);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/profile",

    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  );

  const data = await res.json();

  return NextResponse.json({
    totalEmails: data.messagesTotal,
    threads: data.threadsTotal,
  });
}

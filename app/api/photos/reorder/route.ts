import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let ids: string[];
  try {
    const body = await req.json();
    if (!Array.isArray(body?.ids)) throw new Error("ids must be an array");
    ids = body.ids;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    await db.$transaction(
      ids.map((id, index) =>
        db.photo.update({ where: { id }, data: { order: index } })
      )
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reorder]", err);
    return NextResponse.json({ error: "Reorder failed" }, { status: 500 });
  }
}

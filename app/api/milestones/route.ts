import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const milestones = await db.milestone.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(milestones);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { year: string; title: string; titleVi: string; body: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.year || !body.title || !body.titleVi || !body.body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const count = await db.milestone.count();
  const milestone = await db.milestone.create({
    data: { year: body.year, title: body.title, titleVi: body.titleVi, body: body.body, order: count },
  });
  return NextResponse.json(milestone);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let ids: string[];
  try { ids = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  await Promise.all(ids.map((id, order) => db.milestone.update({ where: { id }, data: { order } })));
  return NextResponse.json({ ok: true });
}

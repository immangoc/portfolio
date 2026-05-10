import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const slide = await db.heroSlide.update({
      where: { id: params.id },
      data: { ...(body.alt !== undefined ? { alt: body.alt as string } : {}) },
    });
    return NextResponse.json(slide);
  } catch (err) {
    console.error("[slides:patch]", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const slide = await db.heroSlide.findUnique({ where: { id: params.id } });
    if (!slide) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await deleteFromCloudinary(slide.cloudinaryId).catch(console.error);
    await db.heroSlide.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[slides:delete]", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

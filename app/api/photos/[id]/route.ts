import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { order, featured, title, alt, location, year, mood, camera, lens, iso } = body;

  try {
    const photo = await db.photo.update({
      where: { id: params.id },
      data: {
        ...(order !== undefined ? { order: Number(order) } : {}),
        ...(featured !== undefined ? { featured: Boolean(featured) } : {}),
        ...(title !== undefined ? { title: title as string } : {}),
        ...(alt !== undefined ? { alt: alt as string } : {}),
        ...(location !== undefined ? { location: location as string } : {}),
        ...(year !== undefined ? { year: Number(year) } : {}),
        ...(mood !== undefined ? { mood: mood as string[] } : {}),
        ...(camera !== undefined ? { camera: camera as string } : {}),
        ...(lens !== undefined ? { lens: lens as string } : {}),
        ...(iso !== undefined ? { iso: iso === null ? null : Number(iso) } : {}),
      },
    });
    return NextResponse.json(photo);
  } catch (err) {
    console.error("[photo:patch]", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const photo = await db.photo.findUnique({ where: { id: params.id } });
    if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await deleteFromCloudinary(photo.cloudinaryId).catch((err) =>
      console.error("[cloudinary:delete]", err)
    );
    await db.photo.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[photo:delete]", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

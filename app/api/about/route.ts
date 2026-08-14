import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";

export async function GET() {
  const content = await db.aboutContent.findUnique({ where: { id: "main" } });
  return NextResponse.json(content ?? {});
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try { formData = await req.formData(); } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("photo") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    try {
      const existing = await db.aboutContent.findUnique({ where: { id: "main" } });
      if (existing?.photoCloudId) {
        await deleteFromCloudinary(existing.photoCloudId).catch(console.error);
      }
      const bytes = await file.arrayBuffer();
      const uploaded = await uploadToCloudinary(Buffer.from(bytes), { folder: "portfolio/about" });
      const content = await db.aboutContent.upsert({
        where: { id: "main" },
        update: { photoUrl: uploaded.secure_url, photoCloudId: uploaded.public_id },
        create: { id: "main", photoUrl: uploaded.secure_url, photoCloudId: uploaded.public_id },
      });
      return NextResponse.json(content);
    } catch (err) {
      console.error("[about:photo]", err);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  }

  let body: Record<string, string>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowed = ["quote", "bio1", "bio2", "bio3", "photoUrl", "photoCloudId"];
  const data = Object.fromEntries(allowed.filter((k) => k in body).map((k) => [k, body[k]]));

  try {
    const existing = await db.aboutContent.findUnique({ where: { id: "main" } });

    // Delete old profile photo from Cloudinary if a new one is set
    if (data.photoCloudId && existing?.photoCloudId && existing.photoCloudId !== data.photoCloudId) {
      await deleteFromCloudinary(existing.photoCloudId).catch(console.error);
    }

    const content = await db.aboutContent.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });
    return NextResponse.json(content);
  } catch (err) {
    console.error("[about:patch]", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

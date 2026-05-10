import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";

const ALLOWED_FIELDS = ["title", "titleVi", "description", "descriptionVi", "accentColor", "tone",
  "heroImage", "heroCloudId"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("heroImage") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    try {
      const existing = await db.category.findUnique({ where: { slug: params.slug } });
      if (!existing) return NextResponse.json({ error: "Category not found" }, { status: 404 });

      if (existing.heroCloudId) {
        await deleteFromCloudinary(existing.heroCloudId).catch(console.error);
      }

      const bytes = await file.arrayBuffer();
      const uploaded = await uploadToCloudinary(Buffer.from(bytes), { folder: "portfolio/heroes" });

      const category = await db.category.update({
        where: { slug: params.slug },
        data: { heroImage: uploaded.secure_url, heroCloudId: uploaded.public_id },
      });
      return NextResponse.json(category);
    } catch (err) {
      console.error("[category:hero-upload]", err);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only allow whitelisted fields
  const data = Object.fromEntries(
    ALLOWED_FIELDS.filter((k) => k in body).map((k) => [k, body[k]])
  );
  if (Object.keys(data).length === 0)
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });

  try {
    const category = await db.category.update({ where: { slug: params.slug }, data });
    return NextResponse.json(category);
  } catch (err) {
    console.error("[category:patch]", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

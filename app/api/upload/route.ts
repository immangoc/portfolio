import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary, getBlurDataURL } from "@/lib/cloudinary";
import { db } from "@/lib/db";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic"];
const MAX_SIZE_MB = 20;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "File type not supported" }, { status: 400 });
  if (file.size > MAX_SIZE_MB * 1024 * 1024)
    return NextResponse.json({ error: `File too large (max ${MAX_SIZE_MB}MB)` }, { status: 400 });

  const categorySlug = formData.get("categorySlug") as string;
  if (!categorySlug) return NextResponse.json({ error: "Category required" }, { status: 400 });

  const alt = (formData.get("alt") as string) || file.name.replace(/\.[^.]+$/, "");
  const title = (formData.get("title") as string) || undefined;
  const location = (formData.get("location") as string) || undefined;
  const year = parseInt(formData.get("year") as string) || new Date().getFullYear();
  const camera = (formData.get("camera") as string) || undefined;
  const lens = (formData.get("lens") as string) || undefined;
  const iso = formData.get("iso") ? parseInt(formData.get("iso") as string) : undefined;
  const featured = formData.get("featured") === "true";

  let mood: string[] = [];
  try {
    mood = JSON.parse((formData.get("mood") as string) || "[]");
  } catch {
    mood = [];
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await uploadToCloudinary(buffer, {
      folder: `portfolio/${categorySlug}`,
    });

    const blurDataURL = getBlurDataURL(uploaded.public_id);
    const existingCount = await db.photo.count({ where: { categorySlug } });

    const photo = await db.photo.create({
      data: {
        cloudinaryId: uploaded.public_id,
        src: uploaded.secure_url,
        alt,
        title,
        location,
        year,
        mood,
        camera,
        lens,
        iso,
        featured,
        width: uploaded.width,
        height: uploaded.height,
        blurDataURL,
        categorySlug,
        order: existingCount,
      },
    });

    return NextResponse.json({ success: true, photo });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

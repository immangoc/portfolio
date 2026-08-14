import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary, getBlurDataURL } from "@/lib/cloudinary";
import { db } from "@/lib/db";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic"];
const MAX_SIZE_MB = 100;

export async function GET() {
  const slides = await db.heroSlide.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const cloudinaryId = formData.get("cloudinaryId") as string | null;
  const src = formData.get("src") as string | null;

  try {
    let uploaded: {
      public_id: string;
      secure_url: string;
    };

    let alt = (formData.get("alt") as string) || "";

    if (cloudinaryId && src) {
      uploaded = {
        public_id: cloudinaryId,
        secure_url: src,
      };
      if (!alt) {
        alt = "Slide";
      }
    } else {
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
      if (!ALLOWED_TYPES.includes(file.type))
        return NextResponse.json({ error: "File type not supported" }, { status: 400 });
      if (file.size > MAX_SIZE_MB * 1024 * 1024)
        return NextResponse.json({ error: `File too large (max ${MAX_SIZE_MB}MB)` }, { status: 400 });

      if (!alt) {
        alt = file.name.replace(/\.[^.]+$/, "");
      }

      const bytes = await file.arrayBuffer();
      const uploadedResult = await uploadToCloudinary(Buffer.from(bytes), { folder: "portfolio/hero-slides" });
      uploaded = {
        public_id: uploadedResult.public_id,
        secure_url: uploadedResult.secure_url,
      };
    }

    const count = await db.heroSlide.count();
    const slide = await db.heroSlide.create({
      data: {
        cloudinaryId: uploaded.public_id,
        src: uploaded.secure_url,
        alt,
        order: count,
      },
    });
    return NextResponse.json({ success: true, slide });
  } catch (err) {
    console.error("[slides:upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

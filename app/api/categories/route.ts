import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Public endpoint: Get all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: { photos: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(categories);
  } catch (err) {
    console.error("[categories:get]", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// Protected endpoint: Create a new category
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, title, titleVi, description, descriptionVi, heroImage, heroCloudId, accentColor, tone } = body;

    if (!slug || !title || !titleVi || !description || !descriptionVi || !accentColor || !tone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const category = await db.category.create({
      data: {
        slug,
        title,
        titleVi,
        description,
        descriptionVi,
        heroImage,
        heroCloudId,
        accentColor,
        tone,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("[categories:post]", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

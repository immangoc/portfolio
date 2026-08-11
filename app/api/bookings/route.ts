import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Public endpoint: Submit a new booking inquiry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contact, concept, date, message } = body;

    if (!name || !contact) {
      return NextResponse.json(
        { error: "Name and contact info are required." },
        { status: 400 }
      );
    }

    const booking = await db.booking.create({
      data: {
        name,
        contact,
        concept: concept || "Áo Dài",
        date: date || null,
        message: message || null,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (err) {
    console.error("[bookings:create]", err);
    return NextResponse.json(
      { error: "Failed to submit booking inquiry." },
      { status: 500 }
    );
  }
}

// Protected endpoint: Get all booking inquiries for admin
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await db.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (err) {
    console.error("[bookings:get]", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings." },
      { status: 500 }
    );
  }
}

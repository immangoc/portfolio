import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Protected endpoint: Update booking status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { status } = body;

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await db.booking.update({
      where: { id: params.id },
      data: { ...(status ? { status } : {}) },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[bookings:patch]", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

// Protected endpoint: Delete a booking
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db.booking.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[bookings:delete]", err);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}

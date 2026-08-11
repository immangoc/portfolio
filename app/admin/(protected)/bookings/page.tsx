import { db } from "@/lib/db";
import { BookingsClient } from "./BookingsClient";

export const metadata = {
  title: "Bookings — Admin Nguyệt Minh",
};

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates to ISO strings for client component compatibility
  const formattedBookings = bookings.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));

  return <BookingsClient initialBookings={formattedBookings} />;
}

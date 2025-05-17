import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  // Get current user from session
  const { user } = await getCurrentSession();
  if (!user) {
    return NextResponse.json([], { status: 401 });
  }
  const notifications = await prisma.notifications.findMany({
    where: { AND: { user_id: user.id, is_read: false } },
    orderBy: [{ is_read: "asc" }, { created_at: "desc" }],
    take: 50, // Fetch latest 50 notifications
  });
  return NextResponse.json(notifications);
}

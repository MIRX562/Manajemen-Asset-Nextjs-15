import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const notifications = await prisma.notifications.findMany({
    orderBy: { created_at: "desc" },
    take: 50, // Fetch latest 50 notifications
  });

  return NextResponse.json(notifications);
}

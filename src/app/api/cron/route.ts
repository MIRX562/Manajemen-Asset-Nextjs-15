import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { NotificationType } from "@prisma/client";

export async function GET() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    // Find maintenance tasks scheduled for tomorrow
    const upcomingMaintenances = await prisma.maintenance.findMany({
      where: {
        scheduled_date: {
          gte: tomorrow,
          lte: endOfTomorrow,
        },
      },
      include: {
        asset: true,
        mechanic: true,
      },
    });

    if (upcomingMaintenances.length === 0) {
      return NextResponse.json({ message: "No upcoming maintenance" });
    }

    // Create notifications
    const notifications = upcomingMaintenances.map((maintenance) => ({
      message: `Maintenance scheduled for asset ${
        maintenance.asset.name
      } on ${maintenance.scheduled_date.toDateString()}.`,
      type: NotificationType.PEMELIHARAAN,
    }));

    await prisma.notifications.createMany({
      data: notifications,
    });

    return NextResponse.json({
      message: "Notifications created",
      count: notifications.length,
    });
  } catch (error) {
    console.error("Error checking maintenance notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

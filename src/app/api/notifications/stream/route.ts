// app/api/notifications/stream/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export async function GET(request: Request) {
  const { user } = await getCurrentSession();
  if (!user) return null;
  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(async () => {
        try {
          // Fetch unread notifications ordered by creation time
          const newNotifications = await prisma.notifications.findMany({
            where: { is_read: false, user_id: user.id },
            orderBy: { created_at: "desc" },
          });

          if (newNotifications.length > 0) {
            // Stream new notifications
            controller.enqueue(`data: ${JSON.stringify(newNotifications)}\n\n`);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
          controller.close();
        }
      }, 5000); // Poll every 5 seconds

      // Stop polling and close the stream when client disconnects
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

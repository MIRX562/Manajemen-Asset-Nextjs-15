import { NextRequest } from "next/server";
import { notificationEmitter } from "@/lib/eventEmitter";
import { Notifications } from "@prisma/client";
import { getCurrentSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const sendNotification = (notification: Notifications) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(notification)}\n\n`)
        );
      };

      notificationEmitter.on("new_notification", sendNotification);

      req.signal.addEventListener("abort", () => {
        notificationEmitter.off("new_notification", sendNotification);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

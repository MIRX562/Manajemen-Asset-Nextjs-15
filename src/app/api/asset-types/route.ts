import { getCurrentSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const types = await prisma.assetType.findMany({
      select: {
        id: true,
        model: true,
      },
    });

    return NextResponse.json({ types }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 }
    );
  }
}

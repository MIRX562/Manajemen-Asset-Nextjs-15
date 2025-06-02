import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const categories = await prisma.assetType.findMany({
      select: { manufacturer: true },
      distinct: ["manufacturer"],
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

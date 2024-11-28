import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const types = await prisma.assetType.findMany();

    return NextResponse.json({ types }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 }
    );
  }
}

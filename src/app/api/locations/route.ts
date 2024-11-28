import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const locations = await prisma.location.findMany();

    return NextResponse.json({ locations }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 }
    );
  }
}

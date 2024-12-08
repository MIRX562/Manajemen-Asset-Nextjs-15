import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mechanics = await prisma.user.findMany({
      where: {
        role: Role.TEKNISI,
      },
      select: {
        id: true,
        username: true,
      },
    });

    return NextResponse.json({ mechanics }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 }
    );
  }
}

import { NextResponse } from "next/server";
import { registerAndRefresh } from "@/lib/auth";
import { z } from "zod";

const RegisterSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = RegisterSchema.parse(body);

    const { email, password, username } = parsedBody;

    await registerAndRefresh(username, email, password);

    return NextResponse.json(
      { message: "User registered successfully, you are logged in." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 400 }
    );
  }
}

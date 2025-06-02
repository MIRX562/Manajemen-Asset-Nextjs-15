import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = LoginSchema.parse(body);

    const { email, password } = parsedBody;

    await login(email, password);

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
